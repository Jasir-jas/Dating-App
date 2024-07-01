import React, { useContext } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import Navbar_logo from '../../imageIcon/dating_logo.png'
import profile_icon from '../../imageIcon/profile_icon.png'
import { UserContext } from '../../Context/UserProvider'


const Navbar = () => {
    // const user = useContext(UserContext)
    const { user, loading, logout } = useContext(UserContext);

    if (loading) {
        return <nav><span>Loading...</span></nav>; // Display loading indicator
    }
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={Navbar_logo} alt="Logo" />
                </Link>
                <span className='username'>Welcome, {user.name}</span>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    {user ? (
                        <>
                            <Link to="/profile" className="nav-link">Profile</Link>
                            <Link to="/messages" className="nav-link">Messages</Link>
                            <button className="nav-link logout-button" onClick={logout}>Logout</button>
                            <div className="nav-avatar">
                                <img src={profile_icon} alt="User Avatar" className="avatar-img" />
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </div>
                <div className="navbar-menu-icon">
                    <i className="fas fa-bars"></i>
                </div>
            </div>
        </nav>
    );
};
export default Navbar
