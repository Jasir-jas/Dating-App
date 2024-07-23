import React, { useState, useEffect } from 'react';
import './Request.css';
import profileimage from '../../imageIcon/men_Image.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Request = () => {
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchRequests = async () => {
    //         try {
    //             const token = localStorage.getItem('token');
    //             if (!token) {
    //                 console.error('No token found.');
    //                 return;
    //             }

    //             const [sentResponse, receivedResponse] = await Promise.all([
    //                 axios.get('http://localhost:4000/users/sent-requests', {
    //                     headers: { 'Authorization': `Bearer ${token}` }
    //                 }),
    //                 axios.get('http://localhost:4000/users/received-requests', {
    //                     headers: { 'Authorization': `Bearer ${token}` }
    //                 })
    //             ]);

    //             if (sentResponse.data.success) {
    //                 setSentRequests(sentResponse.data.sentRequests);
    //                 console.log("Sent Data:", sentResponse.data.sentRequests);
    //             } else {
    //                 console.error('Failed to fetch sent requests');
    //             }

    //             if (receivedResponse.data.success) {
    //                 const pendingRequests = receivedResponse.data.receivedRequests.filter(req => req.status !== 'accepted');
    //                 setReceivedRequests(pendingRequests);
    //                 console.log("received requests:", pendingRequests);
    //             } else {
    //                 console.error('Failed to fetch received requests');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching friend requests:', error);
    //         }
    //     };

    //     fetchRequests();
    // }, []);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found.');
                    return;
                }

                const [sentResponse, receivedResponse] = await Promise.all([
                    axios.get('http://localhost:4000/users/sent-requests', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:4000/users/received-requests', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (sentResponse.data.success) {
                    setSentRequests(sentResponse.data.sentRequests);
                    console.log("Sent Data:", sentResponse.data.sentRequests);
                } else {
                    console.error('Failed to fetch sent requests');
                }

                if (receivedResponse.data.success) {
                    const pendingRequests = receivedResponse.data.receivedRequests.filter(req => req.status !== 'accepted');
                    setReceivedRequests(pendingRequests);
                    console.log("Received Data:", pendingRequests);
                } else {
                    console.error('Failed to fetch received requests');
                }
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchRequests();
    }, []);

    const handleProfileView = async (userId, isReceivedRequest) => {
        if (!userId) {
            console.error('userId is undefined');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found.');
                return;
            }

            const response = await axios.get(`http://localhost:4000/receive-profileView/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                const profile = response.data.profile;
                navigate(`/profileView/${userId}`, { state: { profile, isReceivedRequest } });
            } else {
                console.error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };


    const handleAcceptRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found.');
                return;
            }

            const response = await axios.post(
                `http://localhost:4000/users/accept-request/${requestId}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                setReceivedRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
                navigate(`/profileView/${response.data.acceptedRequest.sender._id}`, {
                    state: {
                        profile: response.data.acceptedRequest.sender,
                        isReceivedRequest: true,
                        requestAccepted: true,
                        isFriend: true,
                    }
                });
            } else {
                console.error(response.data.message || 'Failed to accept friend request');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };


    const handleRejectRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found.');
                return;
            }

            const response = await axios.post(
                `http://localhost:4000/users/reject-request/${requestId}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                setReceivedRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
            } else {
                console.error('Failed to reject friend request', response.data.message);
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const handleCancelRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found.');
                return;
            }

            const response = await axios.post(
                `http://localhost:4000/users/cancel-request/${requestId}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                setSentRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
            } else {
                console.error('Failed to cancel friend request', response.data.message);
            }
        } catch (error) {
            console.error('Error cancelling friend request:', error);
        }
    };

    // return (
    //     <div className='request'>
    //         <div className="left-request-container">
    //             <h3 className='send-request-heading'>Sent Requests</h3>
    //             {sentRequests.map(request => (
    //                 <div key={request._id} className="sent-request-profile">
    //                     <img src={request.receiver.photo || profileimage} alt="Receiver Profile" className='sender-profileImage' />
    //                     <h5 className="sender-name">{request.receiver.name}</h5>
    //                     <i className="fas fa-times" onClick={() => handleCancelRequest(request._id)}></i>
    //                 </div>
    //             ))}
    //         </div>

    //         <div className="vertical-line"></div>

    //         <div className="right-request-container">
    //             <h3 className='receive-request-heading'>Received Requests</h3>
    //             {receivedRequests.map(request => (
    //                 <div key={request._id} className="received-request-profile"
    //                     onClick={() => handleProfileView(request.sender._id, true)}>

    //                     <img src={request.sender.profile_image_urls[0] || profileimage} alt="Sender Profile" className='receiver-profileImage' />
    //                     <h5 className="receiver-name">{request.sender.name}</h5>

    //                     <i className="fas fa-times" onClick={(e) => { e.stopPropagation(); handleRejectRequest(request._id); }}></i>
    //                     <i className="fas fa-check" onClick={(e) => { e.stopPropagation(); handleAcceptRequest(request._id); }}></i>

    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
    return (
        <div className='request'>
            <div className="left-request-container">
                <h3 className='send-request-heading'>Sent Requests</h3>
                {sentRequests.map(request => (
                    <div key={request._id} className="sent-request-profile">
                        {request.receiver && (
                            <>
                                <img
                                    src={request.receiver.profile_image_urls || profileimage}
                                    alt="Receiver Profile"
                                    className='sender-profileImage'
                                />
                                <h5 className="sender-name">{request.receiver.name}</h5>
                            </>
                        )}
                        <i className="fas fa-times" onClick={() => handleCancelRequest(request._id)}></i>
                    </div>
                ))}
            </div>

            <div className="vertical-line"></div>

            <div className="right-request-container">
                <h3 className='receive-request-heading'>Received Requests</h3>
                {receivedRequests.map(request => (
                    <div key={request._id} className="received-request-profile"
                        onClick={() => handleProfileView(request.sender._id, true)}>

                        {request.sender && (
                            <>
                                <img
                                    src={request.sender.profile_image_urls || profileimage}
                                    alt="Sender Profile"
                                    className='receiver-profileImage'
                                />
                                <h5 className="receiver-name">{request.sender.name}</h5>
                            </>
                        )}
                        <i className="fas fa-times" onClick={(e) => { e.stopPropagation(); handleRejectRequest(request._id); }}></i>
                        <i className="fas fa-check" onClick={(e) => { e.stopPropagation(); handleAcceptRequest(request._id); }}></i>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Request;

