import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Register.css'
import googleIcon from '../../imageIcon/googleIcon.png'
import { Link } from 'react-router-dom'


function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    })
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("")
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [message])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        console.log(`URL: ${window.location.href}`); // Log the entire URL
        console.log(`Token from URL: ${token}`); // Log the token

        if (token) {
            localStorage.setItem('token', token);
            window.location.replace('/shortlong');
        } else {
            console.log('Token not found in URL');
        }
    }, []);

    const handleGoogle = () => {
        window.open('http://localhost:4000/auth/google', '_self');
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = form

        if (form.password !== form.confirm_password) {
            console.log("Password don't match");
            setMessage("Password don't match")
            return
        }
        try {
            const response = await axios.post("http://localhost:4000/register", {
                name,
                email,
                password
            })
            console.log("Response:", response);
            setMessage(response.data.message)
            if (response.data.success) {
                window.location.replace("/login")
            } else {
                setMessage(response.data.message)
            }
        } catch (error) {
            setMessage(error.response.data.message)
        }

    }

    return (
        <form className='register' onSubmit={handleSubmit}>
            <h1>Register</h1>

            <div className="register-input-section">

                <label htmlFor="name">Name:</label>
                <input type="text" name='name' value={form.name} onChange={handleChange} />
                <label htmlFor="email">Email:</label>
                <input type="email" name='email' value={form.email} onChange={handleChange} />

                <label htmlFor="password">Password:</label>
                <input type="password" name='password' value={form.password} onChange={handleChange} />

                <label htmlFor="confirm_password">Re-Enter Password:</label>
                <input type="password" name='confirm_password' value={form.confirm_password} onChange={handleChange} />

                <button type='submit' onClick={handleSubmit} className='register-btn'>Register</button>
            </div>
            <p>If You Have Alredy Account? <Link to='/login' className='login-link'>Login</Link></p>
            <div className="google-login">
                <img src={googleIcon} alt="" />
                <button type='button' onClick={handleGoogle} className='google-btn'>Login with Google</button>
                {
                    message && <p className='error-message'>{message}</p>
                }
            </div>

        </form>
    )
}

export default Register
