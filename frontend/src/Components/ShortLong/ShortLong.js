import React, { useState } from 'react'
import './ShortLong.css'

function ShortLong() {
    const [selectOption, setSelectOption] = useState("")


    const handleSubmit = ()=>{
        if(selectOption === 'dating'){
            window.location.replace('/')
        }else{
            window.location.href('/matrimony')
        }
    }


    return (
        <div className="short-long">
            <h1>Do you want Short Time or Long Time?</h1>
            <div className="checkbox">
                <div className="checkbox-item">
                    <input type="radio" id="dating"
                        value="dating" name="time"
                        checked={selectOption === 'dating'}
                        onChange={(e) => setSelectOption(e.target.value)}
                    />
                    <p>Short Time [Redirect to Dating App]</p>
                </div>
                <div className="checkbox-item">
                    <input type="radio" id="matrimony"
                        value="matrimony" name="time"
                        checked={selectOption === 'matrimony'}
                        onChange={(e)=>setSelectOption(e.target.value)}
                    />
                    <p>Long Time [Redirect to Matrimony App]</p>
                </div>
            </div>
            <button type="button" className="ok-btn" onClick={handleSubmit}>Ok</button>
        </div>
    )
}

export default ShortLong
