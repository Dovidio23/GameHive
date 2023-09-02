import { styled } from "styled-components"
import { COLORS } from "./GlobalStyles"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { StarComponent } from "./StarIcon"
import { useContext } from "react"
import { UserContext } from "./UserContext"
import { ReviewModal } from "./ReviewModal"
import { isLoggedIn } from "./Utility"
import { ReviewTile } from "./ReviewTile"





export const GameDetailPage = () => {
    const { gameId } = useParams()
    const [gameDetail, setGameDetail] = useState(null)
    const [gameScreenshots, setGameScreenshots] = useState([])
    const [isExpanded, setIsExapanded] = useState(false)
    const { userFavorites, setUserFavorites } = useContext(UserContext)
    const authToken = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const [reviewModal, setReviewModal] = useState(false)
    const [reviews, setReviews] = useState(null)

    const isFavorite = userFavorites.some(favorite => favorite.gameId === parseInt(gameId))

    const handleReviewModalOpen = () => {
        setReviewModal(true)
    }

    const handleStarClick = async () => {
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
                        gameId: gameDetail.id,
                        name: gameDetail.name,
                        imageUrl: gameDetail.background_image,
                    },
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to update game favorites');
            }

            setUserFavorites(prevUserFavorites => {
                if (isFavorite) {
                    return prevUserFavorites.filter(fav => fav.gameId !== parseInt(gameId));
                } else {
                    return [...prevUserFavorites, {
                        gameId: gameDetail.id,
                        name: gameDetail.name,
                        imageUrl: gameDetail.background_image
                    }];
                }
            });

        } catch (error) {
            console.error('Error updating game favorites:', error);
        }
    }

    useEffect(() => {
        const fetchReviewsByGame = async () => {
            try {
                const response = await fetch(`http://localhost:4000/reviews/${gameId}`);
                if (!response.ok) {
                    throw new Error("Request Failed");
                }
                const data = await response.json();
                setReviews(data.reviews);
                console.log(reviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviewsByGame();
    }, [gameId]);

    useEffect(() => {
        const fetchGameDetail = async () => {
            try {
                const response = await fetch(
                    `https://api.rawg.io/api/games/${gameId}?key=0a56a388bb1348fcb30500ac14ad5534`,
                );
                if (!response.ok) {
                    throw new Error("Request failed")
                }
                const data = await response.json()
                setGameDetail(data)
            } catch (error) {
                console.error("Error fetching game details:", error)
            }
        }
        fetchGameDetail()
    }, [gameId])

    useEffect(() => {
        const fetchGameScreenshots = async () => {
            try {
                const response = await fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=0a56a388bb1348fcb30500ac14ad5534`)
                if (!response.ok) {
                    throw new Error("Request failed")
                }
                const data = await response.json()
                setGameScreenshots(data.results || [])

            } catch (error) {
                console.error("Error fetching  game Screenshots:", error)
            }
        }
        fetchGameScreenshots()
    }, [gameId])

    if (!gameDetail) {
        return <div>Loading...</div>;
    }
    const toggleDescription = () => {
        setIsExapanded(!isExpanded)
    }

    const shortDescription = gameDetail.description.slice(0, 350)

    return (
        <GameDetailContainer backgroundImage={gameDetail.background_image}>
            <GameInfo>
                <Header>{gameDetail.name}</Header>
                <Rating>Rating {gameDetail.rating}/{gameDetail.rating_top} Released {gameDetail.released}</Rating>
                <H3>About</H3>
                <Description dangerouslySetInnerHTML={{ __html: isExpanded ? gameDetail.description : shortDescription }} />
                <StyledButton onClick={toggleDescription}>{isExpanded ? "Show less" : "Show more"}</StyledButton>

                <ScreenShotGrid>
                    {Array.isArray(gameScreenshots) && gameScreenshots.slice(0, 4).map(screenshot => (
                        <ScreenShots key={screenshot.id} src={screenshot.image} />
                    ))}
                </ScreenShotGrid>
                <A href={gameDetail.website}>{gameDetail.website}</A>
                <ButtonsContainer>
                    <FavoriteButton isFavorite={isFavorite} onClick={handleStarClick}>
                        <StarComponent StarComponent isFavorite={isFavorite} />
                        <ButtonText>{isFavorite ? "Saved" : "Add to Favorites"}</ButtonText>
                    </FavoriteButton>
                    {isLoggedIn() &&
                        <button onClick={handleReviewModalOpen}>Write a Review</button>
                    }
                </ButtonsContainer>
                <GenrePlatform>
                    <div>
                        <H3>Genres</H3>
                        {gameDetail.genres.slice(0, 3).map(genre => (
                            <p key={genre.id}>{genre.name}</p>
                        ))}
                    </div>
                    <div>
                        <H3>Platforms</H3>
                        {gameDetail.parent_platforms.slice(0, 3).map(item => (
                            <p key={item.platform.id}>{item.platform.name}</p>
                        ))}
                    </div>
                    <div>
                        <H3>Devs</H3>
                        {gameDetail.developers.slice(0, 3).map(developer => (
                            <p key={developer.id}>{developer.name}</p>
                        ))}
                    </div>
                </GenrePlatform>
                <h3>Reviews</h3>
                <ReviewsContainer>
                    {reviews.length === 0 ? (
                        <NoReviews>No reviews for {gameDetail.name} have been posted</NoReviews>
                    ) : (
                        reviews.map((review) => (
                            <ReviewTile key={review._id} review={review} />
                        ))
                    )}
                </ReviewsContainer>
            </GameInfo>

            {reviewModal && <ReviewModal gameDetail={gameDetail} isOpen={reviewModal} onClose={() => { setReviewModal(false) }} />}
        </GameDetailContainer>
    )
}

const GameDetailContainer = styled.div`
border-radius: 10px;
background-image: radial-gradient(circle, rgba(24, 26, 30, 0.9), rgba(24, 26, 30, 1)),
                    url(${props => props.backgroundImage});
background-size: cover;
background-repeat: repeat-y;
min-height: 100vh; 
z-index: 0;
`
const GameInfo = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`
const Header = styled.h1`
font-size: 60px;
`
const ScreenShots = styled.img`
width: 200px;
height: 90px;
border-radius: 10px;
opacity: 0.5;
cursor: pointer;
transition: all 200ms ease;
&:hover {
    opacity: 1;
    scale: 1.03;
}
`
const GameImage = styled.img`
position: absolute;
width: 91%;
height: 800px;
opacity: 0.03;
border-radius: 20px;
`
const GenrePlatform = styled.div`
display: flex;
flex-direction: row;
text-align: center;
justify-content: space-between;
width: 400px;
& div{
    width: 100px;
}
`
const H3 = styled.h3`
text-decoration: underline;
color: ${COLORS.orange};
`
const Rating = styled.p`
margin-top: -30px;
opacity: 0.5;
`
const ScreenShotGrid = styled.div`
display: grid;
grid-template-rows: 1fr ;
grid-template-columns: 1fr 1fr;
grid-gap: 15px;
margin: 20px;
`
const Description = styled.div`
margin: -20px 400px -5px;
font-size: 15px;
`
const StyledButton = styled.button`
cursor: pointer;
width: 8%;
height: 25px;
background-color: transparent;
border: none;
color: white;
font-weight: bold;
border: 1px solid ${COLORS.orange};
border-radius: 20px;
opacity: 0.5;
margin-top: 10px;
&:hover {
    opacity: 1;
}
`
const A = styled.a`
text-decoration: none;
cursor: pointer;
color: white;
opacity: 0.5;
&:hover {
    opacity: 1;
}
`
const FavoriteButton = styled.button`
display: flex;
justify-content: center;
align-items: center;
`
const ButtonsContainer = styled.div`
display:flex;
& button {
    margin: 0px 15px;
    
margin-top: 15px;
width: 180px;
height: 40px;
font-size: 17px;
color:white ;
background-color: transparent;
border: 1px solid ${COLORS.orange};
cursor: pointer;
border-radius: 20px;
transition: all 200ms ease;
&:hover {
    scale: 1.05;
    border: 2px solid ${COLORS.orange};
}
}
`
const ButtonText = styled.span`
margin-left: 10px;
`
const ReviewsContainer = styled.div`
width: 50%;
`
const NoReviews = styled.div`
text-align: center;
border: 1px solid ${COLORS.light_grey};
border-radius: 20px;
padding: 10px;
`