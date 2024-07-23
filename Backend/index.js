const express = require('express');
const passport = require('passport');
const mongoose = require("mongoose")
const cookieSession = require('cookie-session');
const User = require("./Models/User")
const bcrypt = require("bcrypt")
const cors = require('cors')
const jwt = require("jsonwebtoken")
require('dotenv').config();
require('./Passport');  // Ensure this is after passport import
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const Profile = require("./Models/ProfileDB")
const Employee = require('./Models/EmployementDB')
const FriendRequest = require('./Models/FriendRequest');
const upload = require('./Multer/Multer')
const authentication = require('./Middleware/Authentication');

// This is for socket io
const http = require('http')
const socketIo = require('socket.io');
const Message = require('./Models/MessageDB');
const app = express();
const server = http.createServer(app)
const { Server } = require('socket.io')
app.use(cors())
const io = new Server(server, {
    cors: {
        transports: ['websocket'],
        origin: 'http://localhost:3000', // Allow requests from your frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
        credentials: true,
    }
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



// Middleware
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 100
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch(err => {
        console.error(err)
    });



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
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Wrong Email Id please check it");
            return res.status(401).json({ message: 'Wrong Email Id please check it' });
        }

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            console.log("Incorrect password");
            return res.status(401).json({ message: 'Incorrect Password' });
        }

        const token = generateToken(user);
        user.token = token;
        await user.save();
        return res.json({ success: true, message: 'Successfully Logged In', token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/upload', upload.fields([
    { name: 'profile_image', maxCount: 3 },
    { name: 'profile_video', maxCount: 1 }
]), async (req, res) => {
    try {
        // console.log("files:",req.files);
        const profile_image_urls = req.files.profile_image ? req.files.profile_image.map(file => file.path) : [];
        const profile_video_urls = req.files.profile_video ? req.files.profile_video.map(file => file.path) : [];

        if (profile_image_urls.length === 0 && profile_video_urls.length === 0) {
            throw new Error("No files uploaded");
        }

        res.json({
            success: true,
            message: "Files successfully uploaded",
            profile_image_urls,
            profile_video_urls
        });
        console.log("Files successfully uploaded:", profile_image_urls, profile_video_urls);
    } catch (error) {
        console.error("File uploading error:", error.message);
        res.status(500).json({ success: false, message: "File uploading error: " + error.message });
    }
});

app.post('/profile', authentication, async (req, res) => {
    try {
        const {
            age, dateofbirth, hobbies, interest, qualification,
            smokingHabits, drinkingHabits, profile_image_urls,
            profile_image_url1, profile_image_url2, profile_video_urls
        } = req.body;

        console.log('Received data:', req.body);

        // Validate required fields
        if (!age || !dateofbirth || !hobbies || !interest || !qualification ||
            !smokingHabits || !drinkingHabits || !profile_image_urls ||
            !profile_image_url1 || !profile_image_url2 || !profile_video_urls) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = new Profile({
            userId,
            age,
            dateofbirth,
            hobbies,
            interest,
            qualification,
            smokingHabits,
            drinkingHabits,
            profile_image_urls,
            profile_image_url1,
            profile_image_url2,
            profile_video_urls,
            email: user.email
        });

        await profile.save();

        res.json({ success: true, message: "Profile added successfully", profile });
        console.log("Profile added successfully");
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});

app.post("/employee", authentication, async (req, res) => {
    try {
        const { userCurrent, companyname, designation, location, title, expertiselevel } = req.body

        if (!userCurrent) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const userId = req.user._id
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        let employeeData = {
            userId,
            userCurrent,
            email: user.email
        }
        if (userCurrent === 'employee') {
            employeeData = { ...employeeData, companyname, designation, location }
        } else if (userCurrent === 'jobseeker') {
            employeeData = { ...employeeData, title, expertiselevel }
        } else {
            res.status(400).json({ message: "Invalid User" })
        }

        const employee = new Employee(employeeData)
        await employee.save()

        res.status(201).json({
            success: true, message: "Successfully Saved", userCurrent, employee
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

app.post('/shortlong', authentication, async (req, res) => {
    try {
        const { userRelationStatus, viewGender } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ message: "User not Found" });
        }

        const employee = await Employee.findOne({ userId });

        if (!employee) {
            return res.json({ message: "Employee data Not Found" });
        }

        // Update the userRelationStatus and genderView fields
        if (userRelationStatus) {
            employee.userRelationStatus = userRelationStatus;
        }
        if (viewGender) {
            employee.genderView = viewGender;
        }

        await employee.save();
        res.json({ message: "Relation Status and Gender View saved", success: true, employee });
    } catch (error) {
        console.log(error);
        res.json({ message: "Server Error" });
    }
});

app.get('/getUserProfile', authentication, async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ message: "Profile data not found" });
        }

        res.json({ success: true, profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});


app.put('/profile', authentication, async (req, res) => {
    try {
        const userId = req.user._id
        const {
            age, dateofbirth, hobbies, interest, qualification,
            smokingHabits, drinkingHabits, profile_image_urls,
            profile_image_url1, profile_image_url2, profile_video_urls
        } = req.body;

        const updatedProfile = {
            age, dateofbirth, hobbies, interest, qualification,
            smokingHabits, drinkingHabits, profile_image_urls,
            profile_image_url1, profile_image_url2, profile_video_urls
        }

        const profile = await Profile.findOneAndUpdate({ userId }, updatedProfile, { new: true })

        if (!profile) {
            res.json({ message: "Your Profile not found" })
        }
        res.json({ success: true, message: "Data Successfully Updated..", profile })
    } catch (error) {
        console.log("server error");
        res.json({ message: "Server Error", error })
    }
})


app.get('/', authentication, async (req, res) => {
    try {
        const user = req.user;
        res.json({ success: true, user }); // Send user data as response
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/allUsers', authentication, async (req, res) => {
    try {
        const users = await User.find();

        const userProfiles = await Profile.find({ userId: { $in: users.map(user => user._id) } });
        const userEmployees = await Employee.find({ userId: { $in: users.map(user => user._id) } });

        const usersWithDetails = users.map(user => {
            const profile = userProfiles.find(profile => profile.userId.equals(user._id));
            const employee = userEmployees.find(employee => employee.userId.equals(user._id));
            return { ...user._doc, profile, employee };
        });

        res.json({ success: true, users: usersWithDetails });
    } catch (error) {
        console.error('Error fetching users data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/users/send-request', authentication, async (req, res) => {
    try {
        const senderId = req.user._id;
        const { receiverId } = req.body;

        // Check if a request already exists
        const existingRequest = await FriendRequest.findOne({
            sender: senderId,
            receiver: receiverId
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        const newRequest = new FriendRequest({
            sender: senderId,
            receiver: receiverId
        });

        await newRequest.save();
        res.json({ success: true, message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send friend request', error });
    }
});

// Accept friend request
app.post('/users/accept-request/:requestId', authentication, async (req, res) => {
    try {
        const { requestId } = req.params;
        const currentUser = req.user;

        if (!requestId) {
            return res.status(400).json({ success: false, message: 'Request ID is required' });
        }

        // Find the friend request by ID
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ success: false, message: 'Friend request not found' });
        }

        // Check if the current user is the receiver
        if (friendRequest.receiver.toString() !== currentUser._id.toString()) {
            return res.status(400).json({ success: false, message: 'Not authorized to accept this request' });
        }

        // Add each user to the other's friends list
        await User.findByIdAndUpdate(currentUser._id, {
            $push: { friends: friendRequest.sender },
            $pull: { friendRequests: requestId }
        });

        await User.findByIdAndUpdate(friendRequest.sender, {
            $push: { friends: currentUser._id },
            $pull: { friendRequests: requestId }
        });

        // Remove the friend request from the collection
        await FriendRequest.findByIdAndDelete(requestId);

        // Fetch the sender's profile
        const senderProfile = await User.findById(friendRequest.sender).populate('profile');

        res.json({
            success: true,
            message: 'Friend request accepted',
            isFriend: true,
            acceptedRequest: {
                sender: {
                    _id: senderProfile._id,
                    name: senderProfile.name,
                    profile: senderProfile.profile
                }
            }
        });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// Reject friend request
app.post('/users/reject-request/:requestId', authentication, async (req, res) => {
    try {
        const { requestId } = req.params;
        const currentUser = req.user;

        // Find the friend request by ID
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        // Check if the current user is the receiver
        if (friendRequest.receiver.toString() !== currentUser._id.toString()) {
            return res.status(400).json({ error: 'Not authorized to reject this request' });
        }

        // Remove the friend request from the receiver's friendRequests array
        currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== requestId);
        await currentUser.save();

        // Remove the friend request from the sender's friendRequests array
        const sender = await User.findById(friendRequest.sender);
        if (sender) {
            sender.friendRequests = sender.friendRequests.filter(id => id.toString() !== requestId);
            await sender.save();
        }

        // Delete the friend request document
        await FriendRequest.findByIdAndDelete(requestId);

        res.json({ success: true, message: 'Friend request rejected' });
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// cancel sent friend request
app.post('/users/cancel-request/:requestId', authentication, async (req, res) => {
    try {
        const { requestId } = req.params;
        const currentUser = req.user;

        // Find the friend request
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ success: false, message: 'Friend request not found' });
        }

        // Remove the request from the sender's and receiver's friendRequests array
        await User.findByIdAndUpdate(friendRequest.sender, { $pull: { friendRequests: requestId } });
        await User.findByIdAndUpdate(friendRequest.receiver, { $pull: { friendRequests: requestId } });

        // Remove the friend request itself
        await FriendRequest.findByIdAndDelete(requestId);

        res.json({ success: true, message: 'Friend request cancelled' });
    } catch (error) {
        console.error('Error cancelling friend request:', error);
        res.status(500).json({ success: false, message: 'Error cancelling friend request' });
    }
});


app.get('/users/sent-requests', authentication, async (req, res) => {
    try {
        const userId = req.user._id;
        const sentRequests = await FriendRequest.find({ sender: userId }).lean();

        const populatedRequests = await Promise.all(sentRequests.map(async (request) => {
            const receiver = await User.findById(request.receiver).select('name').lean();
            if (receiver) {
                const profile = await Profile.findOne({ userId: receiver._id }).lean();
                receiver.profile_image_urls = profile ? profile.profile_image_urls : null;
            }
            request.receiver = receiver;
            return request;
        }));

        res.json({ success: true, sentRequests: populatedRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch sent requests', error });
    }
});

app.get('/users/received-requests', authentication, async (req, res) => {
    try {
        const userId = req.user._id;
        const receivedRequests = await FriendRequest.find({ receiver: userId }).lean();

        const populatedRequests = await Promise.all(receivedRequests.map(async (request) => {
            const sender = await User.findById(request.sender).select('name').lean();
            if (sender) {
                const profile = await Profile.findOne({ userId: sender._id }).lean();
                sender.profile_image_urls = profile ? profile.profile_image_urls : null;
            }
            request.sender = sender;
            return request;
        }));

        res.json({ success: true, receivedRequests: populatedRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch received requests', error });
    }
});



// Fetch user profile
app.get('/receive-profileView/:userId', authentication, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user._id;

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Fetch profile details
        const profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        // Fetch employee details
        const employee = await Employee.findOne({ userId });

        // Check if a friend request has been sent
        const requestSent = await FriendRequest.findOne({
            sender: currentUserId,
            receiver: userId
        });

        const requestReceived = await FriendRequest.findOne({
            sender: userId,
            receiver: currentUserId
        });

        // Check if they are friends
        const isFriend = Array.isArray(user.friends) && user.friends.includes(currentUserId);

        // Combine user, profile, and employee details into one object
        const combinedData = {
            ...user.toObject(), // Convert user document to plain JavaScript object
            profile: profile.toObject(), // Convert profile document to plain JavaScript object
            employee: employee ? employee.toObject() : null // Convert employee document to plain JavaScript object if it exists
        };

        res.json({
            success: true,
            data: combinedData,
            sender: user, // Send user details as sender
            requestSent: !!requestSent,
            requestReceived: !!requestReceived,
            isFriend
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile', error });
    }
});

// Fetching all accepted friends
app.get('/friendsList', authentication, async (req, res) => {
    try {
        const currentUser = req.user;
        const user = await User.findById(currentUser._id);

        if (!user) {
            return res.json({ message: 'User not found' });
        }

        const friends = await Promise.all(user.friends.map(async (friendId) => {
            const friend = await User.findById(friendId).select('name').lean();
            const profile = await Profile.findOne({ userId: friendId }).select('profile_image_urls').lean();

            return {
                ...friend,
                profile_image_urls: profile ? profile.profile_image_urls : null,
            };
        }));

        res.json({ success: true, friends, message: 'Successfully fetched your friends' });
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.json({ message: 'Server not responded' });
    }
});

app.get('/chat-profile/:userId', async (req, res) => {
    const { userId } = req.params
    try {
        const user = await User.findById(userId).select('name')

        if (!user) {
            return res.json({ mesaage: 'User not found' })
        }

        const profile = await Profile.findOne({ userId }).select('profile_image_urls')

        if (!profile) {
            return res.json({ message: 'Profile not found' })
        }
        res.json({ success: true, user: { name: user.name, profileImage: profile.profile_image_urls } });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, error: 'Server error' });

    }
})

app.get('/chat-history', async (req, res) => {
    const { userId, friendId } = req.query;

    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        }).sort({ timestamp: 1 });  // -1 for sorted message

        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});



app.get('/chat-list', async (req, res) => {
    const { userId } = req.query;

    try {
        //Converts the userId from a string to a MongoDB ObjectId type
        const objectId = new mongoose.Types.ObjectId(userId);

        // Find distinct users with whom the current user has had conversations
        const distinctUsers = await Message.distinct("sender", { receiver: objectId });
        distinctUsers.push(...await Message.distinct("receiver", { sender: objectId }));

        // Remove duplicates
        const uniqueUsers = [...new Set(distinctUsers.map(id => id.toString()))];

        // Fetch the latest message and user info for each unique user
        const chatList = await Promise.all(uniqueUsers.map(async (chatUserId) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { sender: objectId, receiver: chatUserId },
                    { sender: chatUserId, receiver: objectId }
                ]
            }).sort({ createdAt: -1 });

            const chatUser = await User.findById(chatUserId).select('name');
            const chatProfile = await Profile.findOne({ userId: chatUserId }).select('profile_image_urls');

            if (chatUser && chatProfile) {
                return {
                    userId: chatUserId,
                    name: chatUser.name,
                    profileImage: Array.isArray(chatProfile.profile_image_urls)
                        ? chatProfile.profile_image_urls[0]
                        : chatProfile.profile_image_urls,
                    lastMessage: lastMessage.text,
                    timestamp: lastMessage.createdAt
                };
            } else {
                return null;
            }
        }));

        // Filter out null values from the chat list
        const validChatList = chatList.filter(chat => chat !== null);

        res.json({ success: true, chatList: validChatList });
    } catch (error) {
        console.error('Error fetching chat list:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});


// This is for shortlist storing
app.post('/shortlist', authentication, async (req, res) => {
    const { itemId, itemType } = req.body;
    const userId = req.user.id; // Ensure this is correctly extracted

    console.log('Received request for shortlisting:', { userId, itemId, itemType });

    try {
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isAlreadyShortlisted = user.shortlist.includes(itemId);

        if (isAlreadyShortlisted) {
            return res.json({ success: true, message: 'Profile already shortlisted' });
        }

        user.shortlist.push(itemId);
        user.shortlistModel.push(itemType);
        await user.save();

        res.json({ success: true, message: `${itemType} shortlisted successfully.` });
    } catch (error) {
        console.error('Error shortlisting item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// geting shorListed profiles
app.get('/shortlist-profiles', authentication, async (req, res) => {
    try {
        const currentUser = req.user;
        const user = await User.findById(currentUser._id);

        if (!user) {
            return res.json({ message: 'User not found' });
        }

        const shortlists = await Promise.all(user.shortlist.map(async (shortlistId) => {
            const shortlist = await User.findById(shortlistId).select('name').lean();
            const profile = await Profile.findOne({ userId: shortlistId }).select('profile_image_urls').lean();

            return {
                ...shortlist,
                profile_image_urls: profile ? profile.profile_image_urls : null,
            };
        }));

        res.json({ success: true, shortListedProfiles: shortlists, message: 'Successfully fetched your friends' });
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.json({ message: 'Server not responded' });
    }
});

// Short Listed friends Remove
app.delete('/:userId/shortlist/:profileId/remove', authentication, async (req, res) => {
    const { userId, profileId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.shortlist = user.shortlist.filter(item => item.toString() !== profileId);
        await user.save();

        res.json({ success: true, message: 'Profile removed from shortlist' });
    } catch (error) {
        console.error("Error removing profile from shortlist:", error);
        res.status(500).json({ message: 'Server error, try again' });
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', ({ userId, friendId }) => {
        if (!userId || !friendId) {
            console.error('Invalid userId or friendId');
            return;
        }

        const room = [userId, friendId].sort().join('_');
        socket.join(room);
        console.log(`User ${userId} joined room ${room}`);
    });

    socket.on('sendMessage', async ({ userId, friendId, message }) => {
        const room = [userId, friendId].sort().join('_');

        // Emit the message to all clients in the room
        io.to(room).emit('receiveMessage', message);

        try {
            // Save the message to the database
            const newMessage = new Message({
                sender: userId,
                receiver: friendId,
                text: message.text,
                timestamp: new Date(),
            });
            await newMessage.save();
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


server.listen(4000, () => {
    console.log('Server is running on port 4000');
});





// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => {
//         console.log('MongoDB connected')
//     })
//     .catch(err => {
//         console.error(err)
//     });

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
