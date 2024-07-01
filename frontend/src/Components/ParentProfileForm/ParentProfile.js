import React, { useState } from 'react';
import ProfileForm from '../Profile/ProfileForm';
import SmokingHabits from '../SmokingHabits/SmokingHabits';
import axios from 'axios';
import DrinkingHabits from '../DrinkingHabits/DrinkingHabits';
import ProfileImage from '../ProfileImage/ProfileImage';

const ParentProfile = () => {
    const initialState = {
        age: '',
        dateofbirth: '',
        hobbies: '',
        interest: '',
        qualification: '',
        smokingHabits: '',
        drinkingHabits: '',
        profile_image_url: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [currentForm, setCurrentForm] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    const handleProfileFormSubmit = (data) => {
        setFormData(prevState => ({
            ...prevState,
            ...data
        }));
        setCurrentForm(2);
    };

    const handleSmokingHabitsSubmit = (data) => {
        setFormData(prevState => ({
            ...prevState,
            smokingHabits: data.smokingHabits
        }));
        setCurrentForm(3);
    };

    const handleDrinkingHabitSubmit = (data) => {
        setFormData(prevState => ({
            ...prevState,
            drinkingHabits: data.drinkingHabits
        }));
        setCurrentForm(4);
    };

    const handleProfileImageSubmit = async (data) => {
        const finalData = {
            ...formData,
            profile_image_url: data.profile_image_url
        };

        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:4000/profile', finalData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
                
            
            console.log('Profile saved successfully:', response.data);
            setErrorMessage('');  // Clear any previous error messages
        } catch (error) {
            console.error('Error saving profile:', error);
            setErrorMessage('There was an error saving your profile. Please try again.');
        }
    };

    return (
        <div>
            {currentForm === 1 && <ProfileForm onSubmit={handleProfileFormSubmit} />}
            {currentForm === 2 && <SmokingHabits onSubmit={handleSmokingHabitsSubmit} />}
            {currentForm === 3 && <DrinkingHabits onSubmit={handleDrinkingHabitSubmit} />}
            {currentForm === 4 && <ProfileImage onSubmit={handleProfileImageSubmit} />}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ParentProfile;

