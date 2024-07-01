import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Add_image_icon from '../../imageIcon/Add_ImageIcon.png'
import './ProfileImage.css'

const ProfileImage = ({ onSubmit }) => {

  const fileIconRef = useRef(null)
  const timeRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadImage, setUploadImage] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('profile_image', selectedImage);

    try {
      setUploadImage(true);
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const profile_image_url = response.data.profile_image_url;
      onSubmit({ profile_image_url });
      setMessage("Image successfully uploaded")
      timeRef.current = setTimeout(() => {
        setMessage("")
      }, 2000)

      setUploadImage(false);
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (error) {
      setMessage("Image upload failed");
      setUploadImage(false);
      console.error(error);
      timeRef.current = setTimeout(() => {
        setMessage("")
      }, 2000)
    }
  };

  const handleIconClick = () => {
    fileIconRef.current.click()
  }

  useEffect(()=>{
    return ()=>{
      if(timeRef.current){
        clearTimeout(timeRef.current)
      }
    }
  },[])

  return (
    <form className='photo-reel' onSubmit={handleSubmit}>
      <h2>Add Profile Pic</h2>
      <div className="profile-image">

        <img src={Add_image_icon} alt="Add Profile Picture"
          onClick={handleIconClick} />

        <input type="file" accept='image/*'
          id='profilePic' onChange={handleChange}
          ref={fileIconRef} style={{ display: 'none' }} />

        {previewUrl && <img src={previewUrl} alt="Preview"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}

        <button type='submit' disabled={uploadImage}>{uploadImage ? 'Uploading...' : 'Upload'}</button>
        {message && <p>{message}</p>}
      </div>
    </form>
  );
};

export default ProfileImage;


// import axios from 'axios';
// import React, { useState, useRef } from 'react';
// import Add_image_icon from '../../imageIcon/Add_ImageIcon.png'
// import './ProfileImage.css'

// const ProfileImage = ({ onSubmit }) => {
//   const fileIconRef = useRef(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploadImage, setUploadImage] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedImage(file);
//     setPreviewUrl(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!selectedImage) return;

//     const formData = new FormData();
//     formData.append('profile_image', selectedImage);

//     try {
//       setUploadImage(true);
//       const response = await axios.post('http://localhost:4000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       const profile_image_url = response.data.profile_image_url;
//       onSubmit({ profile_image_url });

//       setTimeout(() => {
//         setMessage("Image successfully uploaded");
//         setUploadImage(false);
//         setSelectedImage(null);
//         setPreviewUrl(null);
//       }, 2000);

//     } catch (error) {
//       setMessage("Image upload failed");
//       setUploadImage(false);
//       console.error(error);
//     }
//   };

//   const handleIconClick = () => {
//     fileIconRef.current.click();
//   };

//   return (
//     <form className='photo-reel' onSubmit={handleSubmit}>
//       <h2>Add Profile Pic</h2>
//       <div className="profile-image">
//         <img src={Add_image_icon} alt="Add Profile Picture" onClick={handleIconClick} />
//         <input type="file" accept='image/*' id='profilePic' onChange={handleChange} ref={fileIconRef} style={{ display: 'none' }} />
//         {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
//         <button type='submit' disabled={uploadImage}>{uploadImage ? 'Uploading...' : 'Upload'}</button>
//         {message && <p>{message}</p>}
//       </div>
//     </form>
//   );
// };

// export default ProfileImage;
