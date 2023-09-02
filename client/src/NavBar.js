import styled from "styled-components"
import { useNavigate, useLocation } from "react-router-dom"
import { COLORS } from "./GlobalStyles"
import img2 from "./assets/Logo.png"
import { useState } from "react"
import { LoginModal } from './LoginModal'
import { isLoggedIn } from "./Utility"



const NavBar = () => {
    const [loginModal, setLoginModal] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()


    const HubClick = () => {
        navigate('/gamepage')
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }
    const handleLogoClick = () => {
        navigate('/')
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
        window.location.reload()
        navigate('/')
    }

    const handleUsernameClick = () => {
        navigate(`/user/${userId}`)
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }

    const isHomePage = location.pathname === "/"
    const isLoginPage = location.pathname === "/login"
    const isHubPage = location.pathname === "/gamepage"

    const userId = localStorage.getItem("userId")

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    
    return (
        <NavbarConatiner>
        <Navbar>
            <Logo src={img2} onClick={handleLogoClick}></Logo>
            <LoginSignup>
                <Home active={isHomePage} onClick={handleLogoClick}>Home</Home>
                <Hub active={isHubPage} onClick={HubClick}>Explore</Hub>
                {isLoggedIn() ? (
                    <>  
                        <Username onClick={handleUsernameClick}>
                            {capitalizeFirstLetter(localStorage.getItem('username'))}</Username>
                        <Logout onClick={handleLogout}>Logout</Logout>
                    </>
                ) : (
                    <>
                        <Login active={isLoginPage} onClick={() => { setLoginModal(true) }}>Login/Signup</Login>
                    </>
                )}
            </LoginSignup>
            {loginModal && <LoginModal isOpen={loginModal} onClose={() => { setLoginModal(false) }} />}
        </Navbar>
        </NavbarConatiner>
    )
}

const NavbarConatiner = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100%;
z-index: 1;
background-color: ${COLORS.dark_grey};
border-bottom: 1px solid ${COLORS.orange};
border-radius: 100px;

& button {
    margin-left: 60px;
}
`

const Navbar = styled.div`
display: flex;
height: 30px;
justify-content: space-between;
align-items: center;
font-size: 20px;
font-weight: bold;
margin: 15px 80px;
`

const Logo = styled.img`
transition: all 200ms ease;
height: auto;
width: 200px;
&:hover {
    scale: 1.05;
}
`
const LoginSignup = styled.div`
display: flex;

padding: 10px;
`

const Login = styled.button`
background: transparent;
border: none;
color: white;
font-size: 20px;
font-weight: bold;
transition: all 200ms ease;
font-family: 'Didact Gothic', sans-serif;
&:hover {
    scale: 1.04;
    color: ${COLORS.orange};
}
${(props) => props.active && activeButtonStyles}
cursor: pointer;
`
const Home = styled.button`
background: transparent;
border: none;
color: white;
font-size: 20px;
font-weight: bold;
transition: all 200ms ease;
font-family: 'Didact Gothic', sans-serif;
&:hover {
    scale: 1.04;
    color: ${COLORS.orange};
}
${(props) => props.active && activeButtonStyles}
cursor: pointer;`

const Hub = styled.button`
background: transparent;
border: none;
color: white;
font-size: 20px;
font-weight: bold;
transition: all 200ms ease;
font-family: 'Didact Gothic', sans-serif;
&:hover {
    scale: 1.04;
    color: ${COLORS.orange};
}
${(props) => props.active && activeButtonStyles}
cursor: pointer
`

const activeButtonStyles = `
color: ${COLORS.orange};
`

const Logout = styled.button`
background: transparent;
border: none;
color: white;
font-size: 20px;
font-weight: bold;
transition: all 200ms ease;
font-family: 'Didact Gothic', sans-serif;
&:hover {
    scale: 1.04;
    color: ${COLORS.orange};
}
cursor: pointer;
`

const Username = styled.button`
background: transparent;
border: none;
color: white;
font-size: 20px;
font-weight: bold;
transition: all 200ms ease;
font-family: 'Didact Gothic', sans-serif;
&:hover {
    scale: 1.04;
    color: ${COLORS.orange};
}
${(props) => props.active && activeButtonStyles}
cursor: pointer;
`

export default NavBar