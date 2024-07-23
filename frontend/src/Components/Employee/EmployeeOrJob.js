import React, { useState } from 'react'
import './EmployeeOrJob.css'

const EmployeeOrJob = ({ onSubmit }) => {
    const [userCurrent, setuserCurrent] = useState("")


    const handleSubmit = async (event) => {
        event.preventDefault()
        if (onSubmit) {
            onSubmit(userCurrent)
        } else {
            console.error("onSubmit function is not defined")
        }
    }
    return (
        <form className='employee-jobseeker' onSubmit={handleSubmit}>
            <h1>Employee Or Job Seeker?</h1>
            <div className="employee-jobseeker-container">
                <input
                    type="radio"
                    value="employee"
                    // name='userCurrent'
                    checked = {userCurrent === 'employee'}
                    className='employee-radio'
                    onChange={()=>setuserCurrent('employee')}
                />
                <label className='employee-label'>Employee</label>


                <input
                    type="radio"
                    value="jobseeker"
                    // name='userCurrent'
                    className='jobseeker-radio'
                    checked={userCurrent === 'jobseeker'}
                    onChange={() => setuserCurrent('jobseeker')}
                />
                <label className='jobseeker-label'>Job Seeker</label>
            </div>
            <button type='submit' className='employee-job-btn'>Next</button>
        </form>



    )
}

export default EmployeeOrJob
