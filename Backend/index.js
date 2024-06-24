// require('dotenv').config();
const express = require('express');
const passport = require('passport');
const mongoose = require("mongoose")
const cookieSession = require('cookie-session');
require('dotenv').config();
require('./Passport');  // Ensure this is after passport import
const User = require("./Models/User")
const bcrypt = require("bcrypt")
const cors = require('cors')
const jwt = require("jsonwebtoken")
const path = require('path')
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
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

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
    (req, res) => {
        // Successful authentication
        res.redirect(`${FRONTEND_URL}/`);
    }
);

// app.use(express.static(path.join(__dirname, 'public')));

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body
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
        const data = {
            user: {
                id: newUser.id
            }
        }
        const token = jwt.sign(data, "secret_dating")
        res.status(201).json({
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
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            const passCompare = await bcrypt.compare(password, user.password);
            if (passCompare) {
                const data = {
                    user: {
                        id: user.id
                    }
                };

                const token = jwt.sign(data, 'secret_dating');
                res.json({ success: true, message: 'Successfully Logged In', token });
            } else {
                console.log("Incorrect password");
                res.status(401).json({ message: 'Incorrect Password' });
            }
        } else {
            console.log("Wrong Email Id please check it");
            res.status(401).json({ message: 'Wrong Email Id please check it' });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.get('/logout', (req, res) => {
    // const token = ""
    req.logout();
    res.redirect('/');
});

app.get('/', (req, res) => {
    res.send(`Hello ${req.user ? req.user.displayName : 'Guest'}`);
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

