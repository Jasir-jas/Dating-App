import React, { useEffect, useRef, useContext } from 'react';
import './MessageList.css';
import { UserContext } from '../../Context/UserProvider';

const MessageList = ({ messages }) => {
    const messageEndRef = useRef(null);
    const { user: currentUser } = useContext(UserContext);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="messages-container">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender === currentUser._id ? 'sent' : 'received'}`}>
                    <p>{message.text}</p>
                </div>
            ))}
            <div ref={messageEndRef} />
        </div>
    );
};

export default MessageList;

// import React, { useEffect, useRef, useContext } from 'react';
// import './MessageList.css';
// import { UserContext } from '../../Context/UserProvider';

// const MessageList = ({ messages }) => {
//     const messageEndRef = useRef(null);
//     const { user: currentUser } = useContext(UserContext);

//     useEffect(() => {
//         if (messageEndRef.current) {
//             messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     }, [messages]);

//     // Sort messages to ensure the latest message is displayed first
//     const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

//     // Ensure there's a latest message to highlight
//     const latestMessage = sortedMessages[0];

//     return (
//         <div className="messages-container">
//             {sortedMessages.map((message, index) => (
//                 <div
//                     key={index}
//                     className={`message ${message.sender === currentUser._id ? 'sent' : 'received'} ${message._id === latestMessage._id ? 'latest' : ''}`}
//                 >
//                     <p>{message.text}</p>
//                 </div>
//             ))}
//             <div ref={messageEndRef} />
//         </div>
//     );
// };

// export default MessageList;



