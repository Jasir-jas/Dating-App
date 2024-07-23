import React, { useContext, useEffect, useState } from 'react';
import './ShortListUsers.css';
import profile_image from '../../imageIcon/men_Image.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserProvider';

function ShortListUsers() {
    const { user } = useContext(UserContext);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [shortlistProfile, setShortListProfile] = useState([]);

    useEffect(() => {
        const fetchShortListProfiles = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                console.log('No token found');
                return;
            }

            try {
                const response = await axios.get('http://localhost:4000/shortlist-Profiles', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.success && response.data.shortListedProfiles) {
                    console.log("Profiles:", response.data.shortListedProfiles);
                    setShortListProfile(response.data.shortListedProfiles);
                }
            } catch (error) {
                console.log('Server error, try again');
                setError('Server error, try again');
            }
        };
        fetchShortListProfiles();
    }, []);

    const handleShortListRemove = async (profileId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:4000/${user._id}/shortlist/${profileId}/remove`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setMessage(response.data.message);
                setShortListProfile(shortlistProfile.filter(profile => profile._id !== profileId));
                setTimeout(() => {
                    setMessage('')
                }, 2000)
            }
        } catch (error) {
            console.log('Server error, try again');
            setError('Server error, try again');
        }
    };

    return (
        <div className='shortlist-allusers'>
            <h1 className='heading-shortlist'>Short Listed Friends</h1>
            {shortlistProfile.length > 0 ? (
                shortlistProfile.map(shortlist => (
                    <div className="user-details" key={shortlist._id}>
                        <Link to={`/profileView/${shortlist._id}`}>
                            <img src={shortlist.profile_image_urls || profile_image} alt="User profile" className="userprofile-image" />
                        </Link>
                        <p className="username">{shortlist.name}</p>
                        <button className="remove-shortlist-btn" onClick={() => handleShortListRemove(shortlist._id)}>Remove</button>
                        <button className="msg-shortlist-btn">
                            <Link to={`/chat/${shortlist._id}`} style={{ textDecoration: 'none', color: 'white' }}>Message</Link>
                        </button>
                    </div>
                    
                ))
            ) : (
                <p style={{ color: 'white' }}>No shortlisted Profiles</p>
            )}
        </div>
    );
}

export default ShortListUsers;

