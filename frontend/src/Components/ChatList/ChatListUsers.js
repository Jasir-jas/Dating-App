import React, { useContext, useEffect, useState } from 'react';
import './ChatListUsers.css';
import profile_image from '../../imageIcon/men_Image.png';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserProvider';
import axios from 'axios';


const ChatListUsers = () => {
    const { user: currentUser } = useContext(UserContext)
    const [chatUsers, setChatusers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchChatUser = async () => {
            if (!currentUser) return
            
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Token not Found')
                console.log('Token not found')
                setLoading(false)
                return
            }
            try {
                const response = await axios.get('http://localhost:4000/chat-list', {
                    params: { userId: currentUser._id },
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (response.data.success && response.data.chatList) {
                    setChatusers(response.data.chatList)
                    console.log("Chat List:", response.data.chatList);
                } else {
                    setError('Failed to fetch chat list..')
                }
            } catch (error) {
                console.error('Error fetching chat list', error);
                setError('Server error. Please try again later.');
            } finally {
                setLoading(false)
            }
        }
        fetchChatUser()
    }, [currentUser])

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div className='chatlist-users'>
            {chatUsers.map((user) => (
                <Link to={`/chat/${user.userId}`} key={user.userId} className="chatlist-item">
                    <img src={user.profileImage} alt={`${user.name}'s profile`} className="profile-image" />
                    <div className="user-info">
                        <div className="username">{user.name}</div>
                        <div className="last-message">{user.lastMessage}</div>
                    </div>
                    <div className="message-time">{new Date(user.timestamp).toLocaleTimeString()}</div>
                </Link>
            ))}
        </div>
    );
};

export default ChatListUsers;
