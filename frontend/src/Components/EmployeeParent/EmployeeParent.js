import React, { useState } from 'react';
import EmployeeOrJob from '../Employee/EmployeeOrJob';
import EmployeDetails from '../EmployeDetails/EmployeDetails';
import JobseekerDetails from '../JobSeekerDetails/JobSeekerDetails';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeParent = () => {
    const initialValue = {
        userCurrent: "",
        companyname: "",
        designation: "",
        location: "",
        title: "",
        expertiselevel: ""
    };
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialValue);
    const [currentForm, setCurrentForm] = useState(1); // 1 for EmployeeOrJob, 2 for EmployeDetails, 3 for JobseekerDetails
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleEmployeeJobSeekerSubmit = (userCurrent) => {
        setFormData({ ...formData, userCurrent });
        setCurrentForm(userCurrent === 'employee' ? 2 : 3);
    };

    const handleFinalSubmit = async (data) => {
        const finalData = {
            ...formData,
            ...data
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:4000/employee', finalData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                // Navigate to specific detail route based on user role
                if (response.data.userCurrent === 'employee' || response.data.userCurrent === 'jobseeker') {
                    navigate('/shortlong');
                }
                setMessage(response.data.message);
            } else {
                setError(response.data.message || "Failed to save data. Please try again.");
            }

        } catch (error) {
            console.error("Error saving data", error);
            setError(error.response?.data?.message || "Failed to save data. Please try again.");
        }
    };

    return (
        <div>
            {currentForm === 1 && <EmployeeOrJob onSubmit={handleEmployeeJobSeekerSubmit} />}
            {currentForm === 2 && <EmployeDetails onSubmit={handleFinalSubmit} />}
            {currentForm === 3 && <JobseekerDetails onSubmit={handleFinalSubmit} />}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default EmployeeParent;
