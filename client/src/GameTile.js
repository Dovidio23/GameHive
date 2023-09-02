import { styled } from "styled-components"
import { COLORS } from "./GlobalStyles"
import { useNavigate } from "react-router-dom"
import { StarComponent } from "./StarIcon"
import { isLoggedIn } from "./Utility"
import { useContext } from "react"
import { UserContext } from "./UserContext"


export const GameTile = ({ game }) => {
    const { userFavorites, setUserFavorites } = useContext(UserContext)
    const naviagte = useNavigate()
    const authToken = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    const isFavorite = userFavorites.some(favorite => favorite.gameId === game.id)

    const handleGameClick = () => {
        naviagte(`/game/${game.id}`)
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }

    const handleStarClick = async (event) => {
        event.stopPropagation() 
        try {
            const response = await fetch('http://localhost:4000/users/updateFavorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    favorite: {
                        gameId: game.id,
                        name: game.name,
                        imageUrl: game.background_image,
                    },
                }),
            })

            if (!response.ok || !isLoggedIn()) {
                throw new Error('Failed to update game favorites')
            }

            setUserFavorites(prevUserFavorites => {
                if (isFavorite) {
                    return prevUserFavorites.filter(favorite => favorite.gameId !== game.id)
                } else {
                    return [...prevUserFavorites, { gameId: game.id, name: game.name, imageUrl: game.background_image }]
                }
            })
    
        } catch (error) {
            console.error('Error updating game favorites:', error)
        }
    }

    if (!game) {
        return null
    }
    return (
        <GameTileContainer onClick={handleGameClick}>
            <GameImage src={game.background_image} alt={game.name} />
                <TitleAndStar>
                <StarComponent isFavorite={isFavorite} onStarClick={handleStarClick} />
                </TitleAndStar>
            <GameInfo>
                <GameTitle>{game.name}</GameTitle>
                <MetaCritic>Metacritic score[{game.metacritic}]</MetaCritic>
            </GameInfo>
        </GameTileContainer>
    );
}
const GameTileContainer = styled.div`
position: relative;
width: fit-content;
text-align: center;
transition: all 200ms ease;
border-radius: 30px;
cursor: pointer;
display: flex;
flex-direction: column;
overflow: hidden;
&:hover {
    scale: 1.03;
}
`

const GameImage = styled.img`
height: 197px;
width: 350px;
border-top-left-radius: 30px;
border-top-right-radius: 30px;
`

const GameInfo = styled.div`
position: absolute;
bottom: 0;
left: 0;
right: 0;
background-color: rgba(0, 0, 0, 0.7);
color: #fff;

`



const TitleAndStar = styled.div`
position: absolute;
top: 5%;
right: 5%;
background-color: rgba(0, 0, 0, 0.7);
width: 30px; 
height: 30px;
border-radius: 50%; 
display: flex;
justify-content: center; 
align-items: center; 
cursor: pointer;
`;



const GameTitle = styled.p`
font-weight: bold;

`

const MetaCritic = styled.p`
font-weight: bold;

color: ${COLORS.orange};
`