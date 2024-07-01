import React, { useState } from 'react';
import './SmokingHabits.css';

const SmokingHabits = ({ onSubmit }) => {
    const [smokingHabits, setSmokingHabits] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit({ smokingHabits });
    };

    return (
        <form className='smoking-habits' onSubmit={handleSubmit}>
            <h1>Do you Smoke?</h1>
            <div className="smoking-options">

                <label htmlFor="no">
                    <input type="radio" value='No' id='no'
                        checked={smokingHabits === 'No'}
                        onChange={() => setSmokingHabits('No')}
                    />
                    No
                </label>

                <label htmlFor="yes">
                    <input type="radio" value="Yes" id='yes'
                        checked={smokingHabits === 'Yes'}
                        onChange={() => setSmokingHabits('Yes')}
                    />
                    Yes
                </label>

                {/* <label htmlFor="planning_to_quit">
                    <input type="radio" value="Planning to quit" id='planning_to_quit'
                        checked={smokingHabits === 'Planning to quit'}
                        onChange={() => setSmokingHabits('Planning to quit')}
                    />
                    Planning to quit
                </label> */}

            </div>
            <button type="submit">Next</button>
        </form>
    );
};

export default SmokingHabits;
