import React, { useEffect, useState } from 'react';
import ProfileForm from '../Profile/ProfileForm';
import SmokingHabits from '../SmokingHabits/SmokingHabits';
import axios from 'axios';
import DrinkingHabits from '../DrinkingHabits/DrinkingHabits';
import ProfileImage from '../ProfileImage/ProfileImage';
import PhotoReel from '../PhotoReel/PhotoReel';
import ProfileVideo from '../ProfileVideo/ProfileVideo';
import { fetchUserProfile } from '../FetchAllData/FetchUserProfile'
import './ParentProfile.css'

const ParentProfile = () => {
    const initialState = {
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
    };

    const [formData, setFormData] = useState(initialState);
    const [currentForm, setCurrentForm] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [profileisFilled, setUserIsFilled] = useState(false)

    useEffect(() => {
        const checkProfile = async () => {
            const profileData = await fetchUserProfile()
            if (profileData) {
                const isFilled = Object.values(profileData).some(value => value)
                if (isFilled) {
                    setUserIsFilled(true)
                }
            }
        }
        checkProfile()
    }, [])

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

    const handleProfileImageSubmit = (profile_image_urls) => {
        console.log(profile_image_urls);
        setFormData(prevState => ({
            ...prevState,
            profile_image_urls
        }));
        setCurrentForm(5);
    };

    const handleMultipleImagesSubmit = async (urls) => {
        console.log('Data received from PhotoReel:', urls);

        if (urls && urls.length >= 2) {
            setFormData(prevState => ({
                ...prevState,
                profile_image_url1: urls[0],
                profile_image_url2: urls[1]

            }))
        }
        setCurrentForm(6);
    }

    const handleProfileVideoSubmit = async (profile_video_urls) => {
        const finalData = {
            ...formData,
            profile_video_urls
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:4000/profile', finalData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Profile saved successfully:', response.data);
            if (response.data.success) {
                window.location.replace('/employee')
            }
            setErrorMessage('');  // Clear any previous error messages
        } catch (error) {
            console.error('Error saving profile:', error.response ? error.response.data : error.message);
            setErrorMessage('There was an error saving your profile. Please try again.');
        }
    }
    if (profileisFilled) {
        return (
            <div className='message-container'>
                <h1>Profile already filled</h1>
                <p>You have already filled your Profile information. If you want to edit ?</p>
                <button className='edit-profile-btn' onClick={() => window.location.replace('/editProfile')}>Edit Profile</button>
                <button className='exit-profile-btn' onClick={()=>window.location.replace('/')}>Exit</button>
            </div>
        )
    }

    return (
        <div>
            {currentForm === 1 && <ProfileForm onSubmit={handleProfileFormSubmit} />}
            {currentForm === 2 && <SmokingHabits onSubmit={handleSmokingHabitsSubmit} />}
            {currentForm === 3 && <DrinkingHabits onSubmit={handleDrinkingHabitSubmit} />}
            {currentForm === 4 && <ProfileImage onSubmit={handleProfileImageSubmit} />}
            {currentForm === 5 && <PhotoReel onSubmit={handleMultipleImagesSubmit} />}
            {currentForm === 6 && <ProfileVideo onSubmit={handleProfileVideoSubmit} />}


            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ParentProfile;

