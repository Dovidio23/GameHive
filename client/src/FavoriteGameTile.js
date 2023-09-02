import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "./UserContext"



export const FavoriteGameTile = ({ favorite }) => {
    const { userFavorites, setUserFavorites } = useContext(UserContext)
    const naviagte = useNavigate()
    const authToken = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    const isFavorite = userFavorites.some(favorite => favorite.gameId === favorite.gameId)

    const handleGameClick = () => {
        naviagte(`/game/${favorite.gameId}`)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    

    return (
        <TileContainer onClick={handleGameClick}>
            <FavoriteImageContainer>
                <FavoriteImage src={favorite.imageUrl} alt={favorite.name} />
            </FavoriteImageContainer>
            <GameInfo>
                <P>{favorite.name}</P>
            </GameInfo>
        </TileContainer>
    )
}

const TileContainer = styled.div`
position: relative;
width: fit-content;
cursor: pointer;
border-radius: 20px;
transition: all 200ms ease;
overflow: hidden;
margin-bottom: 10px;
    &:hover {
    scale:1.01;
    }
`
const GameInfo = styled.div`
position: absolute;
bottom: 0;
left: 0;
right: 0;
background-color: rgba(0, 0, 0, 0.7);
color: #fff;
text-align: center;
height: 35px;
`

const FavoriteImageContainer = styled.div`
width: 600px; 
height: 110px;
overflow: hidden; 
`

const FavoriteImage = styled.img`
width: 100%;
height: auto;
object-fit: cover;
object-position: top center; 
`

const P = styled.p`
font-weight: bold;
font-size: 20px;
margin-top: 3px;
`