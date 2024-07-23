import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { UserContext } from '../../Context/UserProvider';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user, loading: userLoading } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:4000/allUsers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          console.log("Home Data:", response.data);
          setAllUsers(response.data.users);
        } else {
          console.error('Failed to fetch all users.');
        }
      } catch (error) {
        console.error('Error fetching all users data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const handleHeartClick = (index) => {
    const newLiked = [...liked];
    newLiked[index] = !newLiked[index];
    setLiked(newLiked);
  };

  const handleProfileClick = (profile) => {
    navigate(`/profileView/${profile._id}`, { state: { profile } });
    console.log(profile);
  };

  if (loading || userLoading) {
    return <div>Loading...</div>;
  }

  // Ensure `user` is available before filtering
  if (!user) {
    return <div>Error: User not logged in</div>;
  }

  // Filter out the current logged-in user
  const filteredUsers = allUsers.filter(profile => profile._id !== user._id);

  return (
    <div className='home'>
      {filteredUsers.map((profile, index) => (
        <div className="card" key={index}>
          <img
            src={profile.profile?.profile_image_urls}
            alt="Avatar"
            onClick={() => handleProfileClick(profile)}
          />
          <div className="container">
            <h4><b>{profile.name}</b></h4>
            {profile.profile && (
              <>
                <p>Age: {profile.profile.age}</p>
                <p>Interest: {profile.profile.interest?.join(', ')}</p>
              </>
            )}
            <i
              className={`fas fa-heart ${liked[index] ? 'active' : ''}`}
              onClick={() => handleHeartClick(index)}
            ></i>
            <button className='view-btn' onClick={() => handleProfileClick(profile)}>View</button>
            <i className="fa-solid fa-xmark"></i>
            <div className="tooltip">Don't Show Again</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;









