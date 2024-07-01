import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function HideNavnar({ children }) {

    const location = useLocation()
    const [hidenavbar, setHidenavbar] = useState(false)
    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
            setHidenavbar(false)

        } else {
            setHidenavbar(true)
        }

    }, [location])
    return (
        <div>{hidenavbar && children}</div>
    )
}

export default HideNavnar
