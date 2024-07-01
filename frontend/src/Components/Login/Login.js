import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import googleIcon from '../../imageIcon/googleIcon.png';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', { email, password });
      const token = response.data.token;

      if (!token) {
        throw new Error('Token not provided this time');
      }

      localStorage.setItem('token', token);

      if (response.data.success) {
        setMessage(response.data.message);
        window.location.replace('/profile');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('An error occurred during login. Please try again.');
      console.log('error:', error);
    }
  };

  return (
    <form className="login" onSubmit={handleLogin}>
      <h1>Login</h1>

      <div className="input-section">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Submit</button>

        <p>If you don't have an account? <Link to="/register" className="register-link">Register</Link></p>
      </div>

      <img src={googleIcon} alt="Google Icon" />
      <button type="button" onClick={handleGoogle}>Login with Google</button>

      {message && <p className="error-message">{message}</p>}
    </form>
  );
};

export default Login;


