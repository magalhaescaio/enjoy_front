import { useEffect, useState, useRef } from "react"
import { FiHome, FiHardDrive, FiClock, FiBook, FiUsers, FiBell, FiX, FiLogOut } from 'react-icons/fi'
import { Link } from "react-router-dom"
import { isMobile } from 'react-device-detect'
import classnames from "classnames"
import Modal from 'react-bootstrap/Modal'
import Moment from 'react-moment'

import api from './../../../services/api'

import { DefaultAvatar } from './../../../constants/images'

export default function (props) {
    const [user, setUser] = useState()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [navMenuState, setNavMenuState] = useState(false)
    const [sideIn, setSideIn] = useState(false)
    const [out, setOut] = useState(false)
    const [modalNotification, setModalNotification] = useState(false)

    const [loadingNotifications, setLoadingNotitications] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [unreadNotifications, setUnreadNotifications] = useState(false)

    const ref = useRef(null)
    const { onClickOutside } = props

    const mobileToggle = classnames({
        'nav-container d-flex': true,
        'mobile-top-in mobile-top-ready': !mobileMenuOpen,
        'mobile-top-out': !navMenuState && mobileMenuOpen,
        'mobile-side-ready': navMenuState,
        'mobile-side-in': mobileMenuOpen && sideIn,
        'mobile-side-out': out,
    })

    async function getNotifications() {
        setLoadingNotitications(true)

        try {
            const response = await api.get('/api/v1/user/get_notifications?limit=1000&order_by=desc')
            setNotifications(response.data.data.data)
        } catch (error) {

        }

        setLoadingNotitications(false)
    }

    async function checkNewNotifications() {

        try {
            const response = await api.get('/api/v1/notifications/check')

            setUnreadNotifications(response.data)
        } catch (error) {

        }

    }

    useEffect(() => {
        var data = JSON.parse(localStorage.getItem('OnlyOne-userData'))
        setUser(data)

        // CHECK NEW NOTIFICATIONS
        setTimeout(() => {
            checkNewNotifications()
        }, 30000)
        

        setInterval(() => {
            checkNewNotifications()
        }, 120000)
        // CHECK NEW NOTIFICATIONS

    }, [])



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside && onClickOutside();

                var selection = document.querySelector('.mobile-side-in') !== null

                if (selection) {
                    closeMobileMenu()
                }
            }
        }

        document.addEventListener('click', handleClickOutside, true)

        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [onClickOutside])

    function closeMobileMenu() {
        setOut(true)

        setTimeout(() => {
            setTimeout(() => {
                setNavMenuState(false)
                setOut(false)
                setTimeout(() => {
                    setSideIn(false)

                    setTimeout(() => {
                        setMobileMenuOpen(false)
                    }, 50)
                }, 50)
            }, 50)
        }, 50)
    }


    return (
        <>
            <div id="nav" className={mobileToggle}>
                <div className="nav-content d-flex" ref={ref}>
                    <div className="logo position-relative">
                        <a href="/">
                            <div className="img" style={{width: '100px'}}></div>
                        </a>
                    </div>
                    <div className="user-container d-flex">
                        <div onClick={() => [setModalNotification(true), getNotifications()]} className="notification-button" data-toggle="dropdown" aria-expanded="false">
                            <div className="position-relative d-inline-flex" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                <FiBell style={{ marginRight: '5px', marginTop: '2px', fontSize: '13pt', color: 'white' }} />
                                {unreadNotifications && unreadNotifications.length > 0
                                    ? <span style={{ border: '3px solid red' }} className="position-absolute notification-dot rounded-xl"></span>
                                    : <></>
                                }
                            </div>
                        </div>

                        <div className="d-flex user position-relative" data-toggle="dropdown" aria-expanded="false">
                            <img
                                className="profile"
                                alt={user ? user.name : ''}
                                src={DefaultAvatar}
                            />
                            <div className="name">
                                {user ? user.name : ''}
                            </div>
                        </div>

                    </div>
                    <div className="menu-container flex-grow-1">
                        {/* MENU */}
                        <ul id="menu" className="menu show">
                            <li>
                                <Link
                                    style={!isMobile ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}
                                    onClick={() => isMobile ? closeMobileMenu() : false}
                                    className={`${props.location.pathname === '/' ? 'active' : ''}`} to={'/'}>
                                    <span className="label">
                                        <FiHome style={{ marginTop: '-3px' }} /> &nbsp;
                                        Início
                                    </span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    style={!isMobile ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}
                                    onClick={() => isMobile ? closeMobileMenu() : false}
                                    className={`${props.location.pathname === '/dispositivos' ? 'active' : ''}`} to={'/dispositivos'}>
                                    <span className="label">
                                        <FiHardDrive style={{ marginTop: '-3px' }} /> &nbsp;
                                        Dispositivos
                                    </span>
                                </Link>
                            </li>

                        

                            <li>
                                <Link
                                    style={!isMobile ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}
                                    onClick={() => isMobile ? closeMobileMenu() : false}
                                    className={`${props.location.pathname === '/contatos' ? 'active' : ''}`} to={'/contatos'}>
                                    <span className="label">
                                        <FiBook style={{ marginTop: '-3px' }} /> &nbsp;
                                        Usuários
                                    </span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    style={!isMobile ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}
                                    onClick={() => isMobile ? closeMobileMenu() : false}
                                    className={`${props.location.pathname === '/grupos' ? 'active' : ''}`} to={'/grupos'}>
                                    <span className="label">
                                        <FiUsers style={{ marginTop: '-3px' }} /> &nbsp;
                                        Grupos
                                    </span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    style={!isMobile ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}}
                                    onClick={() => isMobile ? closeMobileMenu() : false}
                                    className={`${props.location.pathname === '/logout' ? 'active' : ''}`} to={'/logout'}>
                                    <span className="label">
                                        <FiLogOut style={{ marginTop: '-3px' }} /> &nbsp;
                                        Sair
                                    </span>
                                </Link>
                            </li>
                        </ul>
                        {/* MENU */}
                    </div>
                    <div className="mobile-buttons-container">

                        <div onClick={() => [setModalNotification(true), getNotifications()]} className="notification-button" data-toggle="dropdown" aria-expanded="false">
                            <div className="position-relative d-inline-flex">
                                <FiBell style={{ marginRight: '25px', marginTop: '7px', fontSize: '13pt' }} />
                                {unreadNotifications && unreadNotifications.length > 0
                                    ? <span style={{ border: '3px solid red' }} className="position-absolute notification-dot rounded-xl"></span>
                                    : <></>
                                }
                            </div>
                        </div>

                        <div id="mobileMenuButton" className="menu-button"
                            onClick={() => [
                                setMobileMenuOpen(!mobileMenuOpen),
                                setTimeout(() => {
                                    setNavMenuState(true)
                                    setTimeout(() => {
                                        setSideIn(true)
                                    }, 100)
                                }, 200)
                            ]}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="cs-icon menu ">
                                <path d="M2 3 18 3M2 10 18 10M2 17 18 17"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="nav-shadow">
                </div>
            </div>


            {/* MODAL NOTIFICATION */}
            <Modal show={modalNotification} onHide={() => setModalNotification(false)} className="modal-left modal">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div style={{ fontFamily: 'Lato' }}>Notificações</div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {loadingNotifications
                        ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: "column" }}>
                            <div className="spinner-border spinner-border-md"></div>
                            <div className="text-primary mt-3">Carregando notificações...</div>
                        </div>
                        : <>

                            {notifications.map((row, index) => {
                                return (
                                    <div className="mb-3" key={index}>
                                        <div className="g-0 row mb-2">
                                            <div className="col" style={{ width: '100%' }}>
                                                <div className="d-inline-block d-flex justify-content-end align-items-end h-100" >
                                                    <div className="text-muted ms-2 mt-n1 lh-1-25 text-right" >
                                                        <Moment format="DD/MM/YYYY HH:mm:ss">{row.created_at}</Moment>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="g-0 mb-2 row">
                                            <div className="col">
                                                <div className="d-flex flex-column  h-100 justify-content-center">
                                                    <div className="d-flex flex-column">
                                                        <div className="">
                                                            <b>{row.title}:</b> &nbsp;
                                                            {row.body}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })}

                        </>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <div className='mb-1 btn btn-background-alternate' onClick={() => setModalNotification(false)}>
                        Fechar &nbsp;
                        <FiX style={{ marginTop: '-2px' }} />
                    </div>
                </Modal.Footer>
            </Modal>
            {/* MODAL NOTIFICATION */}
        </>
    )
}