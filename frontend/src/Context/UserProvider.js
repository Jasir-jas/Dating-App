// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     console.error('No token found.');
//                     setLoading(false);
//                     return;
//                 }

//                 const response = await axios.get('http://localhost:4000', {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 });

//                 if (response.data && response.data.success) {
//                     setUser(response.data.user);
//                 } else {
//                     console.error('Failed to fetch user data.');
//                 }
//             } catch (error) {
//                 console.error('Error fetching user data', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, []);

//     const logout = () => {
//         localStorage.removeItem('token');
//         setUser(null);
//         window.location.replace('/login');
//     };

//     return (
//         <UserContext.Provider value={{ user, setUser, loading, logout }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:4000', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.success) {
                    setUser(response.data.user);
                    console.log('User fetched:', response.data.user);
                } else {
                    console.error('Failed to fetch user data.');
                }
            } catch (error) {
                console.error('Error fetching user data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.replace('/login');
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </UserContext.Provider>
    );
};
