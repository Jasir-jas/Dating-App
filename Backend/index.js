// require('dotenv').config();
const express = require('express');
const passport = require('passport');
const mongoose = require("mongoose")
const cookieSession = require('cookie-session');
const User = require("./Models/User")
const bcrypt = require("bcrypt")
const cors = require('cors')
const jwt = require("jsonwebtoken")
const { env } = require('process');
require('dotenv').config();
require('./Passport');  // Ensure this is after passport import
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const Profile = require("./Models/ProfileDB")
const upload = require('./Multer/Multer')

const authentication = require('./Middleware/Authentication')
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Middleware
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 100
}));

app.use(passport.initialize());
app.use(passport.session());

const generateToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: false
}), async (req, res) => {
    try {
        if (req.user) {
            const token = generateToken(req.user); // Generate token here
            res.redirect(`${FRONTEND_URL}/login?token=${token}`);
        } else {
            res.redirect(`${FRONTEND_URL}/login`);
        }
    } catch (error) {
        console.error('Error during authentication callback:', error);
        res.redirect(`${FRONTEND_URL}/login`);
    }
});

app.post("/register", async (req, res) => {
    const { name, email, password} = req.body
    const existUser = await User.findOne({ email })
    try {
        if (existUser) {
            return res.status(400).json({
                message: "Email already exist"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10)

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashPassword
        })
        await newUser.save()

        const token = generateToken(newUser)
        newUser.token = token
        await newUser.save()
        return res.status(201).json({
            success: true,
            message: "registration Success",
            token
        })
        // window.open('/')
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({
            message: "server error"
        })
    }
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Wrong Email Id please check it");
            return res.status(401).json({ success: false, message: 'Wrong Email Id please check it' });
        }

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            console.log("Incorrect password");
            return res.status(401).json({ success: false, message: 'Incorrect Password' });
        }

        const token = generateToken(user);
        user.token = token;
        await user.save();
        return res.json({ success: true, message: 'Successfully Logged In', token });

        
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/', authentication, async (req, res) => {
    try {
        const user = req.user;
        res.json(user); // Send user data as response
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/upload', upload.single('profile_image'), async (req, res) => {
    try {
        const profile_image_url = req.file.path;
        res.json({ success: true, message: "Image successfully uploaded", profile_image_url });
        console.log("Image successfully uploaded");
    } catch (error) {
        console.log("Image uploading error:", error);
        res.status(500).json({ success: false, message: "Image uploading error" });
    }
});

app.post('/profile',authentication,async (req, res) => {
    try {
        const { age, dateofbirth, hobbies, interest, qualification, smokingHabits, drinkingHabits, profile_image_url } = req.body;

        if (!age || !dateofbirth || !hobbies || !interest || !qualification || !smokingHabits || !drinkingHabits || !profile_image_url) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.json({ message: "User not found" })
        }
        console.log("All fields are provided");

        const profile = new Profile({
            userId,
            age,
            dateofbirth,
            hobbies,
            interest,
            qualification,
            smokingHabits,
            drinkingHabits,
            profile_image_url,
            email: user.email
        });
        await profile.save();
        res.json({ success: true, message: "Profile added successfully", profile });
        console.log("Profile added successfully");
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

