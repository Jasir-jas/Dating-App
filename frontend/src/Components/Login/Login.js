// import React, { useEffect, useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Login.css';
// import googleIcon from '../../imageIcon/googleIcon.png';
// import axios from 'axios';
// import { fetchUserProfile } from '../FetchAllData/FetchUserProfile';
// import { UserContext } from '../../Context/UserProvider';

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser } = useContext(UserContext); // Use the setUser function from UserContext
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');
//     if (token) {
//       localStorage.setItem('token', token);
//     } else {
//       console.log('Token not found in URL');
//     }
//   }, []);

//   const handleGoogle = () => {
//     window.open('http://localhost:4000/auth/google', '_self');
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:4000/login', { email, password });
//       const token = response.data.token;

//       if (!token) {
//         throw new Error('Token not provided this time');
//       }

//       localStorage.setItem('token', token);

//       if (response.data.success) {
//         const profileData = await fetchUserProfile(); // Fetch user profile after login
//         setUser(profileData); // Set user context with the fetched profile data

//         // Check if the profile is filled
//         const isProfileFilled = profileData && Object.values(profileData).some(value => value);
//         if (isProfileFilled) {
//           navigate('/'); // Redirect to home page
//           window.location.reload();

//         } else {
//           navigate('/profile'); // Redirect to profile page
//           window.location.reload();
//         }
//       } else {
//         setMessage(response.data.message);
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('An error occurred during login. Please try again.');
//     }
//   };

//   return (
//     <form className="login" onSubmit={handleLogin}>
//       <h1>Login</h1>
//       <div className="input-section">
//         <label htmlFor="email">Email:</label>
//         <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <label htmlFor="password">Password:</label>
//         <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         <button type="submit">Submit</button>
//         <p>If you don't have an account? <Link to="/register" className="register-link">Register</Link></p>
//       </div>
//       <img src={googleIcon} alt="Google Icon" />
//       <button type="button" onClick={handleGoogle}>Login with Google</button>
//       {message && <p style={{ color: 'green' }} className="error-message">{message}</p>}
//       {error && <p style={{ color: 'red' }} className="error-message">{error}</p>}
//     </form>
//   );
// };

// export default Login;

import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import googleIcon from '../../imageIcon/googleIcon.png';
import axios from 'axios';
import { fetchUserProfile } from '../FetchAllData/FetchUserProfile';
import { UserContext } from '../../Context/UserProvider';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfileAndSetUser(token); // Fetch the user profile after setting the token
    } else {
      console.log('Token not found in URL');
    }
  }, []);

  const fetchUserProfileAndSetUser = async (token) => {
    try {
      const profileData = await fetchUserProfile(token);
      setUser(profileData);

      const isProfileFilled = profileData && Object.values(profileData).some(value => value);
      if (isProfileFilled) {
        navigate('/'); // Redirect to home page
        window.location.reload()
      } else {
        navigate('/profile'); // Redirect to profile page
      }
    } catch (error) {
      console.error('Error fetching user profile after setting token:', error);
    }
  };

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
      fetchUserProfileAndSetUser(token);

      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
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
      {message && <p style={{ color: 'green' }} className="error-message">{message}</p>}
      {error && <p style={{ color: 'red' }} className="error-message">{error}</p>}
    </form>
  );
};

export default Login;



