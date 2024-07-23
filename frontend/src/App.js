import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Home from './Components/Home/Home';
import ShortLong from './Components/ShortLong/ShortLong';
import Navbar from './Components/Navbar/Navbar';
import HideNavnar from './Components/HideNavbar/HideNavnar';
import { UserProvider } from './Context/UserProvider';
import ParentProfile from './Components/ParentProfileForm/ParentProfile';
import EmployeeParent from './Components/EmployeeParent/EmployeeParent';
import EmployeDetails from './Components/EmployeDetails/EmployeDetails';
import JobseekerDetails from './Components/JobSeekerDetails/JobSeekerDetails';
import GenderView from './Components/GenderView/GenderView';
import EditProfile from './Components/EditProfile/EditProfile';
import ProfileView from './Components/ProfileView/ProfileView';
import Request from './Components/Request/Request';
import RequestViewUserDetails from './Components/RequestViewUserDetails/RequestviewUserDetails';
import ChatComponent from './Components/Message/chatComponent';
import ChatListUsers from './Components/ChatList/ChatListUsers';
import FriendsList from './Components/FriendsList/FriendsList'
import ShortListUsers from './Components/ShortListUsers/ShortListUsers';


function App() {
  return (
    <div className="App">
      <HideNavnar >
        <UserProvider>
          <Navbar />
        </UserProvider>
      </HideNavnar>

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/shortlong' element={<ShortLong />} />
        <Route path='/*' element={<ParentProfile />} />
        <Route path='/employee' element={<EmployeeParent />} />
        <Route path='/employedetails' element={<EmployeDetails />} />
        <Route path='/jobseekerdetails' element={<JobseekerDetails />} />
        <Route path='/genderview' element={<GenderView />} />
        <Route path='/editProfile' element={<EditProfile />} />
        <Route path='/profileView/:userId' element={<ProfileView />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Fallback route */}
        <Route path='/requests' element={<Request />} />
        <Route path='/chat/:userId' element={<ChatComponent />} />
        <Route path='/chatList' element={<ChatListUsers />} />
        <Route path='/friendsList' element={<FriendsList />} />
        <Route path='/shortList' element={<ShortListUsers />} />





        {/* <Route path='/requestViewUser' element={<RequestViewUserDetails />} /> */}



      </Routes>

    </div>

  );
}

export default App;


