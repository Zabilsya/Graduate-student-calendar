import React, { useContext, useEffect, useState } from 'react'
import { useNotifications } from '../../hooks/notification.hook'
import { useRequest } from '../../hooks/request.hook'

import './css/style.css'

export const NotificationMenu = ({notifications, viewNotification, userId}) => {
    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () => {
        setShowMenu(showMenu => !showMenu)
    }

    let notViewedNotifications = 0

    return (
        <>
        {showMenu && <div className="overlay" onClick={toggleMenu}></div>}
            <div className={showMenu ? "notification-menu menu-open" : "notification-menu"}>
            {(notifications && notifications.length > 0) && 
                    notifications.sort((left, right) => right.createDt.diff(left.createDt)).map((item, index) => {
                        const viewed = item.viewers.includes(userId)
                        if (!viewed) notViewedNotifications++ 
                        return (
                        <div className="notification" onClick={() => viewNotification(item)} key={item._id}>
                            <div className="notification-header">
                                <div className="notification-time">{item.createDt.format('D MMMM YYYY, HH:mm')}</div>
                            </div>
                            <div className={viewed ? "notification-body" : "notification-body not-viewed"} title={!viewed ? 'Отметить как прочитанное' : ''}>
                                <div className="notification-type">{item.type}</div>
                                <div className="notification-event">{item.eventName}</div>
                                {item.message &&
                                    <div className="notification-message">{item.type}</div>
                                }
                            </div>
                        </div>
                    )})
                }
                 
            </div>

            <span className={showMenu ? "material-icons notification-icon icon-open" : "material-icons notification-icon"} onClick={toggleMenu}>notifications</span>
            {notViewedNotifications > 0 && 
            <span className={showMenu ? "icon-missed icon-missed-open" : "icon-missed"} onClick={toggleMenu}>{notViewedNotifications}</span>
            }
        </>
    )
}