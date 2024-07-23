import React from 'react';
import './RequestViewUserDetails.css'; // Create a corresponding CSS file for styling

const RequestViewUserDetails = ({ user, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>{user.name}</h2>
                <img src={user.profile.profile_image_urls[0] || 'default_photo_url'} alt="Profile" className="profile-image" />
                <p>Email: {user.email}</p>
                <p>Bio: {user.profile.bio}</p>
                {/* Add more user details here */}
            </div>
        </div>
    );
};

export default RequestViewUserDetails;
