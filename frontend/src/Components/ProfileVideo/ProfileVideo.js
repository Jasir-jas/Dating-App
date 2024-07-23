import React, { useEffect, useRef, useState } from 'react'
import './ProfileVideo.css'
import Video_add_Icon from '../../imageIcon/Add_Video_Icon.png'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ProfileVideo = ({ onSubmit }) => {
    const videoIconRef = useRef(null)
    const timeRef = useRef(null)

    const [selectedVideo, setSelectedVide] = useState(null)
    const [previousUrl, setpreviousUrl] = useState(null)
    const [uploadingVideo, setUploadingVideo] = useState(false)
    const [message, setMessage] = useState("")

    const handleChange = (event) => {
        const file = event.target.files[0]
        setSelectedVide(file)
        setpreviousUrl(URL.createObjectURL(file))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedVideo) return

        const formdata = new FormData();
        formdata.append('profile_video', selectedVideo)

        try {
            setUploadingVideo(true)
            const response = await axios.post("http://localhost:4000/upload", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            const profile_video_urls = response.data.profile_video_urls
            onSubmit(profile_video_urls[0])
            setMessage("Video Uploaded Success Fully")

            timeRef.current = setTimeout(() => {
                setMessage("")
            }, 2000)
            setUploadingVideo(false)
            setSelectedVide(false)
            setpreviousUrl(null)
        } catch (error) {
            setMessage("Video Upload failed")
            setUploadingVideo(false)
            console.log(error);

            timeRef.current = setTimeout(() => {
                setMessage("")
            }, 2000)
        }
    }

    const handleIconClick = () => {
        videoIconRef.current.click();
    }

    useEffect(() => {
        if (timeRef.current) {
            clearTimeout(timeRef.current)
        }
    })

    return (
        <form className='profile-video' onSubmit={handleSubmit}>
            <h1>Add Your Video Reel (Optional)</h1>
            <div className="video-upload">
                <img src={Video_add_Icon} alt="video icon" onClick={handleIconClick} />

                <input type="file" accept='video/*'
                    onChange={handleChange} ref={videoIconRef}
                    style={{ display: 'none' }}
                />

                <div className="ppreviewurl">
                    {
                        previousUrl && <video src={previousUrl} controls className='preview-video' />
                    }
                </div>
                <button type='submit' disabled={uploadingVideo}>{uploadingVideo ? 'Uploading' : 'Upload'}</button>
                <button type='submit'><Link to='/employee' className='skip-btn'> Skip </Link></button>
                {message && <p className='error-message'>{message}</p>}
            </div>

        </form>
    )
}

export default ProfileVideo
