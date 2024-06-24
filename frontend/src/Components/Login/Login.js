import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import './Login.css'
import googleIcon from '../../imageIcon/googleIcon.png'
import axios from 'axios';
// import handleGoogle from '../ContinueGoogle/handleGoogle';

const Login = () => {

  const [email, setemail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")


  const handleGoogle = () => {
    window.open('http://localhost:4000/auth/google', '_self');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/login", { email, password })
      if (response.data.success) {
        window.location.replace("/")
        setMessage(response.data.message)

      } else {
        setMessage(response.data.message)
        window.location.replace("/login")
      }
    } catch (error) {
      console.log("error:", error);

    }
  }

  return (
    <form className='login' onSubmit={handleLogin}>
      <h1>Login</h1>

      <div className="input-section">

        <label htmlFor="">Email:</label>
        <input type="email" name='email' value={email} onChange={(e) => setemail(e.target.value)} />

        <label htmlFor="">Password:</label>
        <input type="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} />

        <button>Submit</button>

        <p>If You Have Not Account? <Link to='/register' className='register-link'>Register</Link></p>
      </div>

      {/* <div className="signup-with-google"> */}
      <img src={googleIcon} alt="" />
      <button onClick={handleGoogle}>Login with Google</button>
      {/* </div> */}
      {
        message && <p className='error-message'>{message}</p>
      }
    </form>
  );
};

export default Login;

