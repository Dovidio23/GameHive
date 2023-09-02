import { createContext, useState, useEffect } from "react";
import { isLoggedIn } from "./Utility";
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] =useState(null)
    const [userFavorites, setUserFavorites] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (isLoggedIn()) {
            const fetchFavorites = async () => {
                try {
                        await fetch(`/user/${userId}/favorites`)
                        .then((response) => response.json())
                        .then((data) => {
                            setUserFavorites(data.favorites);
                        });
                } catch (error) {
                    console.error("Error fetching user favorites:", error);
                }
            };
            fetchFavorites();
        }
    }, [userId]);
    useEffect(() => {
        if (isLoggedIn()) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/user/${userId}`);
                    const userData = await response.json();
                    setCurrentUser(userData); 
                    
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
            
        }
    }, [userId]);
    return (
        <UserContext.Provider value={{
            currentUser,
            userFavorites,
            setUserFavorites,
        }}>
            {children}
        </UserContext.Provider>
    );
};
