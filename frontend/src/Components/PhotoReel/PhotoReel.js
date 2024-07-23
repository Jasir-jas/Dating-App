import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Add_image_icon from '../../imageIcon/Add_ImageIcon.png';
import './PhotoReel.css';

const PhotoReel = ({ onSubmit }) => {
    const fileIconRef1 = useRef(null);
    const fileIconRef2 = useRef(null);
    const timeRef = useRef(null);
    const [selectedImages, setSelectedImages] = useState([null, null]);
    const [previewUrls, setPreviewUrls] = useState([null, null]);
    const [uploadImage, setUploadImage] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (event, index) => {
        const file = event.target.files[0];
        const newSelectedImages = [...selectedImages];
        newSelectedImages[index] = file;
        setSelectedImages(newSelectedImages);

        const newPreviewUrls = [...previewUrls];
        newPreviewUrls[index] = URL.createObjectURL(file);
        setPreviewUrls(newPreviewUrls);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedImages[0] && !selectedImages[1]) return;

        const formData = new FormData();
        if (selectedImages[0]) formData.append('profile_image', selectedImages[0]);
        if (selectedImages[1]) formData.append('profile_image', selectedImages[1]);

        try {
            setUploadImage(true);
            const response = await axios.post('http://localhost:4000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Response:", response);

            const profile_image_urls = response.data.profile_image_urls;
            onSubmit(profile_image_urls); // Pass only URLs array
            setMessage("Images successfully uploaded");

            timeRef.current = setTimeout(() => {
                setMessage("");
            }, 2000);

            setUploadImage(false);
            setSelectedImages([null, null]);
            setPreviewUrls([null, null]);
        } catch (error) {
            setMessage("Image upload failed");
            setUploadImage(false);
            console.error(error);

            timeRef.current = setTimeout(() => {
                setMessage("");
            }, 2000);
        }
    };

    const handleIconClick = (index) => {
        if (index === 0) {
            fileIconRef1.current.click();
        } else {
            fileIconRef2.current.click();
        }
    };

    useEffect(() => {
        return () => {
            if (timeRef.current) {
                clearTimeout(timeRef.current);
            }
        };
    }, []);

    return (
        <form className='photo-reel' onSubmit={handleSubmit}>
            <h2>Add More Images</h2>
            <div className="profile-image-container">
                <div className="profile-image">
                    <img src={Add_image_icon} alt="Add Profile Picture" onClick={() => handleIconClick(0)} />
                    <input
                        type="file"
                        accept='image/*'
                        onChange={(e) => handleChange(e, 0)}
                        ref={fileIconRef1}
                        style={{ display: 'none' }}
                    />
                </div>

                <div className="profile-image">
                    <img src={Add_image_icon} alt="Add Profile Picture" onClick={() => handleIconClick(1)} />
                    <input
                        type="file"
                        accept='image/*'
                        onChange={(e) => handleChange(e, 1)}
                        ref={fileIconRef2}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            <div className="preview-container">
                {previewUrls.map((url, index) =>
                    url && <img key={index} src={url} alt="Preview" className="preview-image" />
                )}
            </div>

            <button type='submit' disabled={uploadImage}>
                {uploadImage ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default PhotoReel;
