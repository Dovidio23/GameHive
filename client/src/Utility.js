import jwt_decode from "jwt-decode"
import ProfilePic1 from "./assets/ProfilePic1.png"
import ProfilePic2 from "./assets/ProfilePic2.png"
import ProfilePic3 from "./assets/ProfilePic3.png"
import ProfilePic4 from "./assets/ProfilePic4.png"
import ProfilePic5 from "./assets/ProfilePic5.png"
import ProfilePic6 from "./assets/ProfilePic6.png"
import ProfilePic7 from "./assets/ProfilePic7.png"
import ProfilePic8 from "./assets/ProfilePic8.png"
import ProfilePic9 from "./assets/ProfilePic9.png"
import ProfilePic10 from "./assets/ProfilePic10.png"

export const availableProfileImages = [
    ProfilePic1,
    ProfilePic2,
    ProfilePic3,
    ProfilePic4,
    ProfilePic5,
    ProfilePic6,
    ProfilePic7,
    ProfilePic8,
    ProfilePic9,
    ProfilePic10,
]


export const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwt_decode(token)
            return true; 
        } catch (error) {
            return false;
        }
    } else {
        return false;
    }
};
const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000; 
        if (decodedToken.exp < currentTime) {
            
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            window.location.reload()
        }
    }
}

export const setupTokenExpirationCheck = () => {
    checkTokenExpiration();
    const tokenExpirationCheckInterval = setInterval(checkTokenExpiration, 1000); 
    return () => clearInterval(tokenExpirationCheckInterval);
};

