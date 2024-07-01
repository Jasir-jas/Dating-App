import React, { useState } from 'react'
import './DrinkingHabits.css'

const DrinkingHabits = ({ onSubmit }) => {

    const [drinkingHabits, setDrinkingHabits] = useState("")

    const handlesubmit = (e) => {
        e.preventDefault();
        onSubmit({drinkingHabits})
    }

    return (
        <form className='drinking-habits' onSubmit={handlesubmit}>
            <h1>Do you Drink??</h1>
            <div className="drinking-options">

                <label htmlFor="no">
                    <input type="radio" value='No' id='no'
                        checked={drinkingHabits === 'No'}
                        onChange={() => setDrinkingHabits('No')}
                    />
                    No
                </label>

                <label htmlFor="regular">
                    <input type="radio" value="Regular" id='regular'
                        checked={drinkingHabits === 'Regular'}
                        onChange={() => setDrinkingHabits('Regular')}
                    />
                    Regular
                </label>

                <label htmlFor="occasionally">
                    <input type="radio" value="Occasionally" id='occasionally'
                        checked={drinkingHabits === 'Occasionally'}
                        onChange={() => setDrinkingHabits("Occasionally")}
                    />
                    Occasionally
                </label>

            </div>
            <button type="submit">Next</button>
        </form>
    )
}

export default DrinkingHabits
