import { styled } from "styled-components"
import { COLORS } from "./GlobalStyles"
import { useNavigate } from "react-router-dom"
import { HiOutlineThumbDown as HiOutlineHandThumbDown, HiOutlineThumbUp as HiOutlineHandThumbUp } from 'react-icons/hi';


const ReviewIconChoice = ({ type }) => {
    if (type === "thumbsUp") {
        return <HiOutlineHandThumbUp style={{ color: 'green' }} />
    } else if (type === "thumbsDown") {
        return <HiOutlineHandThumbDown style={{ color: 'red' }} />
    } else {
        return null
    }
}

export const ReviewTile = ({ review }) => {
    const navigate = useNavigate()

    const userId = review._id
    const handleReviewTileClick = () => {
        navigate(`/user/${userId}`)
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    
    return (
        <ReviewContainer onClick={handleReviewTileClick}>
            <NameProfilePicContainer>
                <UserImage src={review.profilePicture} alt="User avatar" />
                <p>{capitalizeFirstLetter(review.username)}</p>
            </NameProfilePicContainer>
            {review.reviews.map((reviewItem) => (
                <TextIcon>
                    <ReviewText key={reviewItem.gameId}>{reviewItem.reviewText}</ReviewText>
                    <ReviewIconChoice type={reviewItem.type} />
                </TextIcon>
            ))}
        </ReviewContainer>
    )
}

const ReviewContainer = styled.div`
display: flex;
flex-direction: row;
padding: 6px;
border: 2px solid ${COLORS.light_grey};
border-radius: 20px;
margin-top: 5px;
transition: all 200ms ease;
&:hover {
    scale:1.02;
    cursor: pointer;
}
`
const NameProfilePicContainer = styled.div`
display: flex;
flex-direction: row;
margin-right: 5%;
`
const TextIcon = styled.div`
width: 100%;
display: flex;
`
const UserImage = styled.img`
width: 40px;
height: 40px;
border-radius:50%;

padding: 5px;
`
const ReviewText = styled.p`
color: white;
margin-right:auto;

`
