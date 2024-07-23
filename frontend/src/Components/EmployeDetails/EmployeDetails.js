import React, { useState } from 'react';
import './EmployeeDetails.css';

const EmployeDetails = ({ onSubmit }) => {
    const initialValue = {
        companyname: "",
        designation: "",
        location: ""
    };
    const [formData, setFormData] = useState(initialValue);
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData)
        // Here you can handle the form submission logic, e.g., send data to backend
        console.log("Form Data Submitted: ", formData);
        setMessage('Form data submitted successfully!');
    };

    return (
        <form className='employe-details' onSubmit={handleSubmit}>
            <h1>Employee</h1>
            <div className='company-name-container'>
                <label htmlFor="companyname">Company Name:</label>
                <input
                    type="text"
                    placeholder='e.g., TCS, AWS'
                    value={formData.companyname}
                    name='companyname'
                    onChange={handleChange}
                    className='companyname-input'
                />
            </div>

            <div className='designation-container'>
                <label htmlFor="designation">Designation:</label>
                <input
                    type="text"
                    placeholder='e.g., Junior Developer'
                    name='designation'
                    value={formData.designation}
                    onChange={handleChange}
                    className='designation-input'
                />
            </div>

            <div className="location-container">
                <label htmlFor="location">Location:</label>
                <input
                    type="text"
                    placeholder='Job Location'
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    className='location-input'
                />
            </div>

            <button type='submit' className='employee-details-btn'>Save</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default EmployeDetails;
