import React, { useState } from 'react';
import './jobSeekerDetails.css';

const JobseekerDetails = ({ onSubmit }) => {
    const [jobTitle, setJobTitle] = useState('');
    const [expertiseLevel, setExpertiseLevel] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            title: jobTitle,
            expertiselevel: expertiseLevel,
        };
        onSubmit(data)
        // Handle form submission, e.g., send data to backend
        console.log(data);
    };

    return (
        <form className='jobseeker-details' onSubmit={handleSubmit}>
            <h1>Job Seeker</h1>
            <div className='jobseeker-title-container'>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    placeholder='e.g., Developer, Accountant'
                    name='jobTitle'
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className='title-input'
                />
            </div>

            <div className='expertise-level-container'>
                <h1>Expertise Level</h1>
                <div>
                    <input
                        type="radio"
                        id="beginner"
                        name="expertiseLevel"
                        className='beginner-radio'
                        value="beginner"
                        checked={expertiseLevel === 'beginner'}
                        onChange={(e) => setExpertiseLevel(e.target.value)}
                    />
                    <label htmlFor="beginner">Beginner</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="intermediate"
                        name="expertiseLevel"
                        className='intermediate-radio'
                        value="intermediate"
                        checked={expertiseLevel === 'intermediate'}
                        onChange={(e) => setExpertiseLevel(e.target.value)}
                    />
                    <label htmlFor="intermediate">Intermediate</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="expert"
                        name="expertiseLevel"
                        className='expertise-radio'
                        value="expert"
                        checked={expertiseLevel === 'expert'}
                        onChange={(e) => setExpertiseLevel(e.target.value)}
                    />
                    <label htmlFor="expert">Expert</label>
                </div>
            </div>

            <button type='submit'>Save</button>
        </form>
    );
};

export default JobseekerDetails;
