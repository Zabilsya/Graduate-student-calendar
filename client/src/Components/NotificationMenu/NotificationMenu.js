import React, { useState } from 'react'
import { useNotifications } from '../../hooks/notification.hook'

import './css/style.css'

export const NotificationMenu = ({notifications}) => {
    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () => {
        setShowMenu(showMenu => !showMenu)
    }


    return (
        <>
        {showMenu && <div className="overlay" onClick={toggleMenu}></div>}
            <div className={showMenu ? "notification-menu menu-open" : "notification-menu"}>
                {
                    notifications.map((item, index) => (
                        <div className="notification" key={index}> 
                            {item.eventName}
                        </div>
                    ))
                }
              
            </div>
            <span className={showMenu ? "material-icons notification-icon icon-open" : "material-icons notification-icon"} onClick={toggleMenu}>notifications</span>
            <span className={showMenu ? "icon-missed icon-missed-open" : "icon-missed"} onClick={toggleMenu}>2</span>
        </>
    )
}