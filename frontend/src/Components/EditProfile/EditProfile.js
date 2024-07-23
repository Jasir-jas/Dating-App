import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../FetchAllData/FetchUserProfile' // Adjust the import path as needed
// import './EditProfile.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        dateofbirth: '',
        hobbies: '',
        interest: '',
        qualification: '',
        smokingHabits: '',
        drinkingHabits: '',
        profile_image_urls: '',
        profile_image_url1: '',
        profile_image_url2: '',
        profile_video_urls: ''
    });
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const profile = await fetchUserProfile();
            if (profile) {
                setFormData(profile);
            } else {
                setErrorMessage('There was an error fetching your profile data. Please try again.');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:4000/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data.message)
            console.log('Profile updated successfully:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
            setErrorMessage('There was an error updating your profile. Please try again.');
        }
    };

    return (
        <form className="edit-profile" onSubmit={handleSubmit}>
            <h1>Edit Profile</h1>
            <div className="form-group">
                <label>Age</label>
                <input type="text" name="age" value={formData.age} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dateofbirth" value={formData.dateofbirth} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Hobbies</label>
                <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Interests</label>
                <input type="text" name="interest" value={formData.interest} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Qualification</label>
                <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Smoking Habits</label>
                <input type="text" name="smokingHabits" value={formData.smokingHabits} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Drinking Habits</label>
                <input type="text" name="drinkingHabits" value={formData.drinkingHabits} onChange={handleChange} />
            </div>
            <button type="submit" className="save-btn">Save</button>
            {message && <p style={{color: 'green'}} className="error-message">{message}</p>}
            {errorMessage && <p tyle={{color: 'red'}} className="error-message">{errorMessage}</p>}
        </form>
    );
};

export default EditProfile;
