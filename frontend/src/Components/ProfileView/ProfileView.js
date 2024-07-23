import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import './ProfileView.css';
import axios from 'axios';

const ProfileView = () => {
    const { userId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(location.state?.profile);
    const [sender, setSender] = useState(location.state?.sender);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isReceivedRequest, setIsReceivedRequest] = useState(location.state?.isReceivedRequest);
    const [requestAccepted, setRequestAccepted] = useState(location.state?.requestAccepted);
    const [sentRequest, setSentRequest] = useState(location.state?.requestSent);
    const [isFriend, setIsFriend] = useState(location.state?.isFriend);

    useEffect(() => {
        console.log('Fetching profile data for userId:', userId);

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token found');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:4000/receive-profileView/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    console.log('Fetched profile data:', response.data); // Debugging line
                    setProfile(response.data.data);
                    console.log("Profile:", response.data.data);

                    setSender(response.data.sender);
                    console.log("Sender:", response.data.sender);

                    setIsFriend(response.data.isFriend);
                    setRequestAccepted(response.data.requestAccepted);
                    setSentRequest(response.data.requestSent);
                    setIsReceivedRequest(response.data.requestReceived);
                    setLoading(false);
                } else {
                    setError('Failed to fetch profile');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching profile:', error); // Add error logging
                setError('Server Error');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Profile not found</div>;

    const images = [
        profile?.profile?.profile_image_urls,
        profile?.profile?.profile_image_url1,
        profile?.profile?.profile_image_url2
    ].filter(Boolean);

    const imageClick = () => {
        setCurrentImageIndex((currentImageIndex + 1) % images.length);
    };

    const handleSendFriendRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return;
            }

            const response = await axios.post('http://localhost:4000/users/send-request',
                { receiverId: profile._id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setMessage(response.data.message);
                setSentRequest(true);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Server Error');
        }
    };

    const handleShortList = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Token Not found');
                setError('Token Not Found');
                return;
            }

            console.log('Sending request with:', {
                itemId: profile._id,
                itemType: profile.profile ? 'Profile' : 'Employee'
            });

            const response = await axios.post('http://localhost:4000/shortlist', {
                itemId: profile._id,
                itemType: profile.profile ? 'Profile' : 'Employee'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Server response:', response.data);

            if (response.data.success) {
                setMessage(response.data.message);
            } else {
                setError(response.data.message || 'Not shortlisted, try again');
            }
        } catch (error) {
            console.error('Server Error:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : 'Server Error');
        }
    };



    const handleAcceptRequest = async () => {
        navigate('/requests')
    };

    const handleRejectRequest = () => {
        navigate('/requests');
    };

    if (!profile) {
        return <div>Error: Profile not found</div>;
    }

    return (
        <div className='profileView'>
            <div className="left-container">
                <img src={images[currentImageIndex]} alt="Profile" className='profile-images' onClick={imageClick} />
            </div>

            <div className="right-container">
                <label htmlFor="name">Name :</label>
                <h3 className="profile-name">{profile.name}</h3>

                <label htmlFor="location">Age :</label>
                <h3 className="profile-location">{profile.profile?.age}</h3>

                <label htmlFor="qualification">Qualification :</label>
                <h3 className="profile-qualification">{profile.profile?.qualification}</h3>

                <label htmlFor="interest">Interest :</label>
                <h3 className="profile-interest">{profile.profile?.interest?.join(', ')}</h3>

                <label htmlFor="Hobbies">Hobbies :</label>
                <h3 className="profile-hobbies">{profile.profile?.hobbies?.join(', ')}</h3>

                <label htmlFor="Hobbies">Smoking Habit :</label>
                <h3 className="profile-smokingHabits">{profile.profile?.smokingHabits}</h3>


                <label htmlFor="DrinkingHabits">Drinking Habit :</label>
                <h3 className="profile-drinkingHabits">{profile.profile?.drinkingHabits}</h3>

                <div className="right-container-btns">
                    <button type='button' className='shortlist-btn' onClick={handleShortList}>ShortList</button>
                    <button type='button' className='messages-btn'>
                        <Link to={`/chat/${profile._id}`} style={{ textDecoration: 'none',color:'white' }}>Messages</Link> </button>

                    {isReceivedRequest && !requestAccepted && (
                        <>
                            <button type='button' className='accept-btn' onClick={handleAcceptRequest}>Accept</button>
                            <button type='button' className='reject-btn' onClick={handleRejectRequest}>Reject</button>
                        </>
                    )}

                    {!isReceivedRequest && !requestAccepted && !isFriend && (
                        sentRequest ? (
                            <button type='button' className='request-sent-btn'>Requested..</button>
                        ) : (
                            <button type='button' className='request-sent-btn'
                                onClick={handleSendFriendRequest}>Send Request</button>
                        )
                    )}

                    {requestAccepted && (
                        <button type='button' className='request-sent-btn'>Friend</button>
                    )}

                    {isFriend && (
                        <button type='button' className='request-sent-btn'>Friend</button>
                    )}

                    <button type='button' className='dontshow-btn'>Don't Show</button>

                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>

            <div className="right-container2">
                <label htmlFor="qualification">Employee/JobSeeker :</label>
                <h3 className="profile-qualification">{profile.employee?.userCurrent}</h3>
            </div>
        </div >
    );
};

export default ProfileView;
