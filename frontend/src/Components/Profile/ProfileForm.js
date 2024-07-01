import React, { useState } from 'react';
import './ProfileForm.css';

const ProfileForm = ({ onSubmit }) => {
    const initialState = {
        age: '',
        dateofbirth: '',
        hobbies: '',
        interest: '',
        qualification: '',
    };

    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Tell us about yourself</h2>

            <label htmlFor="age">Age:</label>
            <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
            />

            <label htmlFor="dateofbirth">Date of birth:</label>
            <input
                type="date"
                id="dateofbirth"
                name="dateofbirth"
                value={formData.dateofbirth}
                onChange={handleChange}
                required
            />

            <label htmlFor="hobbies">Hobbies:</label>
            <input
                type="text"
                id="hobbies"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                placeholder="Eg: Reading, playing etc.."
                required
            />

            <label htmlFor="interest">Interest:</label>
            <input
                type="text"
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
            />

            <label htmlFor="qualification">Qualification:</label>
            <select
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
            >
                <option value="">Select Qualification</option>
                <option value="10">10</option>
                <option value="Plus Two">Plus Two</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
                <option value="Diploma">Diploma</option>
                <option value="Other">Other</option>
            </select>

            <button type="submit">Next</button>
        </form>
    );
};

export default ProfileForm;


