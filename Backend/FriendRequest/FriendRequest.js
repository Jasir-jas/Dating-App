// controllers/friendRequestController.js
const User = require('../Models/User'); // Adjust the path as necessary
const FriendRequest = require('../Models/FriendRequest');


const createFriendRequest = async (senderId, receiverId) => {
    try {
        const newRequest = new FriendRequest({
            sender: senderId,
            receiver: receiverId,
            status: 'pending'
        });

        await newRequest.save();

        // Optionally add to sender and receiver's friendRequests array
        await User.findByIdAndUpdate(senderId, { $push: { friendRequests: newRequest._id } });
        await User.findByIdAndUpdate(receiverId, { $push: { friendRequests: newRequest._id } });

        console.log('Friend request created successfully.');
    } catch (error) {
        console.error('Error creating friend request:', error);
    }
};

module.exports = {
    createFriendRequest
};
