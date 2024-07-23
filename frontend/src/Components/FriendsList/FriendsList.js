import React, { useEffect, useState } from 'react';
import './FriendsList.css';
import photo_image from '../../imageIcon/men_Image.png'
import axios from 'axios';

const FriendsList = () => {
    const [friends, setFriends] = useState([])
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {

        const fetchFriends = async () => {

            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    setError("Token Not found")
                    console.log('Token not found');
                }

                const response = await axios.get('http://localhost:4000/friendsList', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (response.data.success) {
                    setFriends(response.data.friends)
                    console.log("Friends List:", response.data.friends);

                    setMessage(response.data.message)
                    console.log(response.data.message);
                } else {
                    setError(response.data.message)
                }

            } catch (error) {
                console.log("Error", error);
                setError("Server Error")

            }
        }
        fetchFriends()

    }, [])
    return (
        <div className='friendsList'>
            <h1>Your Friends</h1>
            {friends.map(friend => (
                <div key={friend._id} className="profile-name">
                    <img
                        src={friend.profile_image_urls || photo_image}
                        alt={`${friend.name}'s profile`}
                        className="userProfile"
                    />
                    <p className="userName">{friend.name}</p>
                    <button className='unFriend-btn'>Friend</button>
                    <button className='friends-message-btn'>Message</button>
                </div>
            ))}
        </div>
    );
}

export default FriendsList;

