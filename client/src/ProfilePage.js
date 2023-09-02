import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import { EditProfilePage } from "./EditProfilePage"
import { FavoriteGameTile } from "./FavoriteGameTile"
import { COLORS } from "./GlobalStyles"
import { ProfileReviewTile } from "./ProfileReviewTile"


export const ProfilePage = () => {
    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const loggedInUserId = localStorage.getItem('userId')
    const [isEditModalOpen, setIsEditModalOpen] = useState()

    useEffect(() => {
        fetch(`/user/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                setUser(data.result)
            })
            .catch((error) => console.error('Error fetching user:', error))
        console.log(user)
    }, [userId])

    const openEditModal = () => {
        setIsEditModalOpen(true)
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false)
    }
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    

    return (
        <StyledProfileBackground backgroundImage={user ? user.profilePicture : null}>
            {user ? (
                <ProfileContainer>
                    <Info>
                        <UsernameImage>
                            <Image src={user.profilePicture} />
                            <Username>{capitalizeFirstLetter(user.username)}</Username>
                        </UsernameImage>
                        <P>Bio: {user.bio}</P>
                        {loggedInUserId === userId && (
                            <EditProfileButton onClick={openEditModal}>Edit profile</EditProfileButton>
                        )}
                        <ReviewContainer>
                            {user.reviews.length > 0 && (
                                <h2>Reviews</h2>
                            )}
                            {user && user.reviews ? (
                                user.reviews.map(review => (
                                    <ProfileReviewTile review={review} user={user} userId={userId} />
                                ))
                            ) : (
                                <p>Loading reviews...</p>
                            )}
                        </ReviewContainer>
                        {isEditModalOpen && (
                            <EditProfilePage
                                isOpen={isEditModalOpen}
                                onClose={closeEditModal}
                                user={user}
                            />
                        )}
                    </Info>
                    <Favorites>
                    {user.favorites.length > 0 && (
                        <h2>Favorites</h2>
                    )}
                        {user.favorites.length > 0 ? (
                            user.favorites.map((favorite) => (
                                <FavoriteGameTile key={favorite.id} favorite={favorite} />
                                ))
                        ) : (
                            <></>
                        )}
                    </Favorites>
                </ProfileContainer>
            ) : (
                <p>Loading user profile...</p>
            )}
        </StyledProfileBackground>
    )
}
const StyledProfileBackground = styled.div`
border-radius: 10px;
background-image: radial-gradient(circle, rgba(24, 26, 30, 0.9), rgba(24, 26, 30, 1)),
    url(${props => props.backgroundImage ? props.backgroundImage : `${COLORS.dark_grey}`});
background-size: cover;
background-repeat: repeat-y;
min-height: 100vh; 
z-index: 0;
`;

const UsernameImage = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    
`
const Username = styled.h1`
    margin-left: 20px;
    font-size: 40px;
`

const ProfileContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`
const Image = styled.img`
width: 300px;
height: 300px;
border-radius: 50%;
`


const EditProfileButton = styled.button`
width: 200px;
height: 30px;
color: white;
background-color: ${COLORS.orange};
border-radius: 10px;
border: none;
font-weight: bold;
font-size: 18px;
transition: all 100ms ease;
margin-top: 60px;
cursor: pointer;
&:hover {
    scale:1.03;
}
`

const Info = styled.div`
width: 100%;
display: flex;
flex-direction: column;
padding: 10px;
`
const P = styled.h3`
    margin-top: -20px;
    margin-left: 250px;
`

const Favorites = styled.div`
width: 600px;
padding: 20px;
border-radius: 20px;
`

const H3 = styled.h3`
text-align: center;
margin-top: 20%;
`
const ReviewContainer = styled.div`
margin-top: 5%;

& h2 {
    margin-bottom: 5%;
}
`