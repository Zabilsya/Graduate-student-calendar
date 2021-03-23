import React, { useContext, useEffect, useState } from 'react'
import { useNotifications } from '../../hooks/notification.hook'
import { useRequest } from '../../hooks/request.hook'

import './css/style.css'

export const NotificationMenu = ({socket, userId}) => {
    const [showMenu, setShowMenu] = useState(false)
    const {notifications, viewNotification} = useNotifications(socket, userId)
    const toggleMenu = () => {
        setShowMenu(showMenu => !showMenu)
    }

    let notViewedNotifications = 0

    return (
        <>
        {showMenu && <div className="overlay" onClick={toggleMenu}></div>}
            <div className={showMenu ? "notification-menu menu-open" : "notification-menu"}>
                {
                    notifications.sort((left, right) => right.createDt.diff(left.createDt)).map((item, index) => {
                        const viewed = item.viewers.contains(userId)
                        if (!viewed) notViewedNotifications++ 
                        return (
                        <div className={viewed ? "notification" : "notification not-viewed"} onClick={() => viewNotification(item)} key={index}>
                            <div className="notification-time">{item.createDt.format('D MMMM YYYY, HH:mm')}</div>
                            <div className="notification-message">{item.type}</div>
                            <div className="notification-event">{item.eventName}</div>
                        </div>
                    )})
                }
              
            </div>
            <span className={showMenu ? "material-icons notification-icon icon-open" : "material-icons notification-icon"} onClick={toggleMenu}>notifications</span>
            {notViewedNotifications && 
            <span className={showMenu ? "icon-missed icon-missed-open" : "icon-missed"} onClick={toggleMenu}>{notViewedNotifications}</span>
            }
        </>
    )
}