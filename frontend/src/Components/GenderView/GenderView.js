import React, { useState } from 'react'
import './GenderView.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const GenderView = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ gender: '' })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post("http://localhost:4000/shortlong", { viewGender: formData.gender }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (response.data.success) {
                setMessage(response.data.message)
                navigate('/')
            }
        } catch (error) {
            console.log(error);
            setError("Data not saved please try again")
        }
    }

    return (
        <form className='gender-view' onSubmit={handleSubmit}>
            <h1>Who Do You Want To See?</h1>
            <div className="genderview-container">
                <div className="radio-item">
                    <input type="radio" className='women-radio'
                        value="women" id="women" name='gender'
                        checked={formData.gender === 'women'} onChange={handleChange}
                    />
                    <label htmlFor="women">Women</label>
                </div>
                <div className="radio-item">
                    <input type="radio" className='men-radio'
                        value="men" id="men" name='gender'
                        checked={formData.gender === 'men'} onChange={handleChange}
                    />
                    <label htmlFor="men">Men</label>
                </div>
                <div className="radio-item">
                    <input type="radio" className='both-radio'
                        value="both" id="both" name='gender'
                        checked={formData.gender === 'both'} onChange={handleChange}
                    />
                    <label htmlFor="both">Both</label>
                </div>
            </div>
            <button type='submit' className='gender-btn'>Save</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    )
}

export default GenderView
