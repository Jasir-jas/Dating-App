import React from 'react';
import axios from 'axios';

const Logout = () => {
    const handleLogout = () => {
        window.open('http://localhost:4000/logout', '_self');
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
