import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Home from './Components/Home/Home';

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter> */}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

      </Routes>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
