import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage
                if (!token) {
                    console.error('No token found.');
                    setLoading(false); // Set loading to false
                    return;
                }

                console.log('Token from local storage:', token); // Debugging log

                const response = await axios.get('http://localhost:4000', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Set the Authorization header
                    },
                });

                console.log('Response data:', response.data); // Debugging log
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        window.location.replace('/login')
    }

    return (
        <UserContext.Provider value={{ user, loading, logout }}>
            {children}
        </UserContext.Provider>
    );
};

