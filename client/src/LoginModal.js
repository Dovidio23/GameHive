import { styled } from "styled-components"
import Modal from "react-modal"
import { COLORS } from "./GlobalStyles";
import { useState } from "react";
import { MdClose } from 'react-icons/md'
Modal.setAppElement("#root")

export const LoginModal = ({ isOpen, onClose,  }) => {
    const [isSignUp, setIsSignUp] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isSignUp) {
            if (!isEmailValid(email)) {
                setError("Please enter a valid email address.")
                return
            }
        }
        if (isSignUp) {
            if (password !== confirmPassword) {
                setError("Passwords do not match.")
                return
            }
        }
        if (password.length < 8) {
            setError("Password has to be atleast 8 characters")
            return
        }
        setError("");
        setIsSuccess(false)
        if (isSignUp) {
            const userData = {
                username,
                email,
                password,
            };
            fetch('/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.message); // Throw the error message to be caught in the catch block
                    }
                    return response.json();
                })
                .then((data) => {
                    
                    setIsSuccess(true)
                    setUsername('')
                    setEmail('')
                    setPassword('')
                    setConfirmPassword('')
                    setError("")
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setError(error.message)
                });
        } else {
            const userData = {
                username,
                password,
            }
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const data = await response.json()
                        throw new Error(data.message)
                    }
                    return response.json()
                })
                .then((data) => {
                    
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('username', data.username)
                    localStorage.setItem('userId', data.userId)
                    setPassword("")
                    setUsername("")
                    onClose()
                    window.location.reload()
                })
                .catch((error) => {
                    console.error('Error', error)
                    setError(error.message)
                })
        }
    }

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const toggleForm = () => {
        setIsSignUp(prevState => !prevState)
        setIsSuccess(false)
        setError("")
        setPassword("")
        setUsername("")
        setEmail('')
        setConfirmPassword('')
        

    }
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Login Modal"
            style={modalStyles}
        >
            <ModalContainer>
                <h2>{isSignUp ? "Sign up" : "Login"}</h2>
                <StyledCloseIcon onClick={onClose} />
                <Form onSubmit={handleSubmit} isSignUp={isSignUp}>
                    {isSuccess && <P>Success! You have created an account!</P>}
                    {error && <P>{error}</P>}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onFocus={(e) => e.target.placeholder = ""}
                        onBlur={(e) => e.target.placeholder = "Username"}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onFocus={(e) => e.target.placeholder = ""}
                            onBlur={(e) => e.target.placeholder = "Email"}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onFocus={(e) => e.target.placeholder = ""}
                        onBlur={(e) => e.target.placeholder = "Password"}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isSignUp && (
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onFocus={(e) => e.target.placeholder = ""}
                            onBlur={(e) => e.target.placeholder = "Confirm password"}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}
                    <Signup type="submit">{isSignUp ? "Sign up" : "Login"}</Signup>
                    <P>
                        {isSignUp
                            ? "Already have an account?"
                            : "Don't have an account yet?"}{" "}
                        <A onClick={toggleForm}>
                            {isSignUp ? "Login" : "Sign Up"}
                        </A>
                    </P>
                </Form>
            </ModalContainer>
        </Modal>
    )
}

const modalStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(3px)",

    },
    content: {
        border: `1px solid ${COLORS.orange}`,
        background: `${COLORS.light_grey}`,
        color: "white",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "500px",
        height: "450px",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
}

const ModalContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-around;
height: 100%;
`

const Form = styled.form`
display: flex;
flex-direction:column;
margin-top:${(props) => (props.isSignUp ? "" : "-150px")} ;
    & input {
        width: 300px;
        border: 1px solid ${COLORS.orange};
        outline: none;
        height: 40px;
        padding: 5px;
        border-radius: 10px;
        background-color: ${COLORS.light_grey};
        margin-bottom: ${(props) => (props.isSignUp ? "15px" : "15px")};
        color: white;
        font-size: 20px;
        transition: all 200ms ease;
        text-align: center;
        &::placeholder {
            text-align: center;
        }
        
        &:focus {
            scale:1.03;
        }
    }
`
const Signup = styled.button`
background-color: ${COLORS.orange};
border: none;
height: 40px;
border-radius: 10px;
color: white;
font-size: 20px;
transition: all 200ms ease;
&:hover {
    scale:1.05;
}
cursor: pointer;
`

const StyledCloseIcon = styled(MdClose)`
position: absolute;
color: ${COLORS.charcoal};
right: 15px;
top: 15px;
transition: all 200ms ease;
    &:hover {
        cursor: pointer;
        scale: 1.3;
        color: ${COLORS.orange};
    }
`

const P = styled.p`
text-align: center;
`

const A = styled.a`
color: ${COLORS.orange};
border-bottom: 1px solid ${COLORS.orange};
cursor: pointer;
`