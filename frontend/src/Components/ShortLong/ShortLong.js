import React, { useState } from 'react';
import './ShortLong.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ShortLong() {
    const navigate = useNavigate();
    const [selectOption, setSelectOption] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setSelectOption(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:4000/shortlong", { userRelationStatus: selectOption }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                setMessage(response.data.message);
                navigate('/genderview');
            }
        } catch (error) {
            console.log("Data not Saved, please try again.");
            setError("Data not Saved, please try again.");
        }
    };

    return (
        <form className="short-long" onSubmit={handleSubmit}>
            <h1>Do you want Short Term or Long Term?</h1>
            <div className="checkbox-container">

                <div className="checkbox-item">
                    <input type="radio" id="dating"
                        value="dating" name="time"
                        checked={selectOption === 'dating'}
                        onChange={handleChange}
                    />
                    <p>Short term Relationship [Dating App]</p>
                </div>
                <div className="checkbox-item">
                    <input type="radio" id="matrimony"
                        value="matrimony" name="time"
                        checked={selectOption === 'matrimony'}
                        onChange={handleChange}
                    />
                    <p>Long term [Matrimony App]</p>
                </div>
            </div>
            <button type="submit" className="ok-btn">Next</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default ShortLong;
