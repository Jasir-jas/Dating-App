import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import './chatComponent.css';
import profile_image from '../../imageIcon/men_Image.png';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../../Context/UserProvider';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid'; // Add this line to generate unique message IDs

const ChatComponent = () => {
    const { userId } = useParams();
    const { user: currentUser, loading } = useContext(UserContext);
    const [messages, setMessages] = useState([]);  // State to store messages
    const [newMessage, setNewMessage] = useState(''); // State to store new message input
    const [friendProfile, setFriendProfile] = useState(null); // for user name and profile
    const messagesEndRef = useRef(null); // Ref to scroll to the bottom of the messages
    const socketRef = useRef(null); // Ref to store socket instance

    useEffect(() => {
        socketRef.current = io('http://localhost:4000', {
            transports: ['websocket'],
            withCredentials: true,
        });

        const socket = socketRef.current;

        if (currentUser && userId) {
            socket.emit('joinRoom', { userId: currentUser._id, friendId: userId });

            socket.on('receiveMessage', (message) => {
                console.log('Received message:', message);
                setMessages(prevMessages => {
                    // Check if the message is already in the list
                    if (!prevMessages.some(m => m.messageId === message.messageId)) {
                        return [...prevMessages, message];
                    }
                    return prevMessages;
                });
            });

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
                socket.emit('joinRoom', { userId: currentUser._id, friendId: userId });
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
            });
        }

        return () => {
            socket.off('receiveMessage');
            socket.disconnect();
        };
    }, [currentUser, userId]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (loading || !currentUser) return;

            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Token not found');
                return;
            }

            try {
                const response = await axios.get('http://localhost:4000/chat-history', {
                    params: { userId: currentUser._id, friendId: userId },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.success) {
                    setMessages(response.data.messages);
                } else {
                    console.error('Failed to fetch chat history.');
                }
            } catch (error) {
                console.error('Error fetching chat history', error);
            }
        };

        const fetchFriendProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/chat-profile/${userId}`);
                if (response.data && response.data.success) {
                    setFriendProfile(response.data.user);
                } else {
                    console.error('Failed to fetch friend profile.');
                }
            } catch (error) {
                console.error('Error fetching friend profile', error);
            }
        };

        fetchChatHistory();
        fetchFriendProfile();
    }, [userId, currentUser, loading]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message = {
            messageId: uuidv4(), // Generate a unique ID for each message
            sender: currentUser._id,
            receiver: userId,
            text: newMessage,
            timestamp: new Date(),
        };

        // Optimistic UI update
        setMessages(prevMessages => [...prevMessages, message]);

        // Emit the message to the server
        socketRef.current.emit('sendMessage', { userId: currentUser._id, friendId: userId, message });

        // Clear the input field
        setNewMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <div>User not found. Please log in.</div>;
    }

    return (
        <div className="chat-container">
            <div className="profile-header">
                <Link>
                    <img src={friendProfile?.profileImage || profile_image} alt="Profile" className="profile-image" />
                </Link>
                <div className="profile-info">
                    <h3 className="profile-name">{friendProfile ? friendProfile.name : 'Loading...'}</h3>
                    <p className="profile-status">Online</p>
                </div>
            </div>
            <div className="messages-container">
                <MessageList messages={messages} />
                <div ref={messagesEndRef} />
            </div>
            <div className="message-input-container">
                <input
                    type="text"
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button className="send-button" onClick={handleSendMessage}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;




