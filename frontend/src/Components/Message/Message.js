// Message.jsx

import React from 'react';
import './Message.css'; // Import your CSS file for styling

const Message = ({ text, sender }) => {
    return (
        <div className={`message ${sender === 'user' ? 'user-message' : 'other-message'}`}>
            <div className="message-content">
                <p className="message-text">{text}</p>
            </div>
        </div>
    );
};

export default Message;
