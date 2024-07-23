// import axios from "axios"

// export const fetchUserProfile = async () => {
//     try {
//         const token = localStorage.getItem('token')
//         const response = await axios.get("http://localhost:4000/getUserProfile", {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//         if (response.data.success) {
//             return response.data.profile
//         }
//         throw new Error("Failed to Fetch User Profile")
//     } catch (error) {
//         console.error(error);
//         return null
//     }

// }

import axios from "axios";

export const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found in localStorage');
        }

        const response = await axios.get("http://localhost:4000/getUserProfile", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.data.success) {
            return response.data.profile;
        } else {
            throw new Error("Failed to fetch user profile: " + response.data.message);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
    }
};
