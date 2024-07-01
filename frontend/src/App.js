import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Home from './Components/Home/Home';
import ShortLong from './Components/ShortLong/ShortLong';
import Navbar from './Components/Navbar/Navbar';
import HideNavnar from './Components/HideNavbar/HideNavnar';
import { UserProvider } from './Context/UserProvider';
import ParentProfile from './Components/ParentProfileForm/ParentProfile';
import PhotoReel from './Components/ProfileImage/ProfileImage';

function App() {
  return (
    <div className="App">
      <HideNavnar >
        <UserProvider>
          <Navbar />
        </UserProvider>
      </HideNavnar>

      <Routes>
        <Route exact path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        {/* <Route path='/login' element={<Login />} /> */}
        <Route path='/register' element={<Register />} />
        <Route path='/shortlong' element={<ShortLong />} />
        <Route path='/*' element={<ParentProfile />} />
        {/* <Route path='/photoreel' element={<PhotoReel />} /> */}



      </Routes>
    </div>

  );
}

export default App;
    