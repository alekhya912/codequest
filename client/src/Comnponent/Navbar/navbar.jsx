/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import bars from '../../assets/bars-solid.svg'
import logo from '../../assets/logo.png'
import search from '../../assets/search-solid.svg'
import Avatar from '../Avatar/Avatar'
import './navbar.css'
import { setcurrentuser } from '../../action/currentuser'
import { jwtDecode } from "jwt-decode"
import { Award } from 'lucide-react'

function Navbar({ handleslidein }) {
    var User = useSelector((state) => state.currentuserreducer)
    const subscription = useSelector((state) => state.subscriptionreducer)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const handlelogout = () => {
        dispatch({ type: "LOGOUT" })
        navigate("/")
        dispatch(setcurrentuser(null))
    }

    useEffect(() => {
        const token = User?.token
        if (token) {
            const decodedtoken = jwtDecode(token)
            if (decodedtoken.exp * 1000 < new Date().getTime()) {
                handlelogout()
            }
        }
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))))
    }, [User?.token, dispatch])

    const getPlanBadgeStyle = (planId) => {
        switch(planId) {
          case 'bronze': return { backgroundColor: '#cd7f32', color: 'white' };
          case 'silver': return { backgroundColor: '#c0c0c0', color: 'white' };
          case 'gold': return { backgroundColor: '#ffd700', color: 'black' };
          default: return { backgroundColor: '#e3e6e8', color: '#3b4045' };
        }
    };

    return (
        <nav className="main-nav">
            <div className="navbar">
                <button className="slide-in-icon" onClick={() => handleslidein()}>
                    <img src={bars} alt="bars" width='15' />
                </button>
                <div className="navbar-1">
                    <Link to='/' className='nav-item nav-logo'>
                        <img src={logo} alt="logo" />
                    </Link>
                    <Link to="/" className="nav-item nav-btn res-nav">About</Link>
                    <Link to="/" className="nav-item nav-btn res-nav">Products</Link>
                    <Link to="/" className="nav-item nav-btn res-nav">For Teams</Link>
                    <Link to="/public-space" className="nav-item nav-btn res-nav">Public Space</Link>
                    <form>
                        <input type="text" placeholder='Search...' />
                        <img src={search} alt="search" width='18' className='search-icon' />
                    </form>
                </div>
                <div className="navbar-2">
                    {User === null ? (
                        <Link to='/Auth' className='nav-item nav-links'>Log in</Link>
                    ) : (
                        <>
                            {subscription?.currentPlan && (
                                <Link to='/subscription/status' className='nav-item plan-badge' style={getPlanBadgeStyle(subscription.currentPlan.id)}>
                                    <Award size={14} />
                                    <span>{subscription.currentPlan.id !== 'free' ? subscription.currentPlan.id.charAt(0).toUpperCase() + subscription.currentPlan.id.slice(1) : 'Free'}</span>
                                </Link>
                            )}
                            <Link to='/subscription/plans' className='nav-item nav-btn'>Upgrade</Link>
                            <Avatar backgroundColor='#009dff' px='10px' py='7px' borderRadius='50%' color="white">
                                <Link to={`/Users/${User?.result?._id}`} style={{ color: "white", textDecoration: "none" }}>
                                    {User.result.name.charAt(0).toUpperCase()}
                                </Link>
                            </Avatar>
                            <button className="nav-item nav-links" onClick={handlelogout}>Log out</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar