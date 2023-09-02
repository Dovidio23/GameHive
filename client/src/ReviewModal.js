import Modal from "react-modal"
import styled from "styled-components"
import { COLORS } from "./GlobalStyles"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { HiOutlineThumbDown as HiOutlineHandThumbDown, HiOutlineThumbUp as HiOutlineHandThumbUp } from 'react-icons/hi';


export const ReviewModal = ({ isOpen, onClose, gameDetail }) => {
    const [reviewType, setReviewType] = useState(null)
    const [reviewText, setReviewText] = useState("")
    const { gameId } = useParams()
    const [error, setError] = useState("")

    const handleReviewSubmit = async (event) => {
        event.preventDefault()

        if (!reviewType) {
            setError("Please select thumbs up or down.")
            return
        }

        try {
            const authToken = localStorage.getItem('token')
            const userId = localStorage.getItem('userId')
            const reviewData = {
                gameId: gameDetail.id,
                name: gameDetail.name,
                reviewText,
                userId,
                type: reviewType
            }
            const response = await fetch(`http://localhost:4000/reviews/${gameId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(reviewData),
            })
            if (!response.ok) {
                throw new Error('Failed to post review')
            }
            window.location.reload()
            onClose()
        } catch (error) {
            console.error('Error posting review', error)
            if (error.message === 'Failed to post review') {
                setError("You've already posted a review for this game.")
                setReviewText("")
            }
        }
    }

    const isReviewTextValid = reviewText.length <= 80

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Login Modal"
            style={modalStyles}
        >
            <ModalContainer>
                <h1>Review</h1>
                {error && <p>{error}</p>}
                <Form onSubmit={handleReviewSubmit}>
                    <ThumbsContainer>
                        <ThumbIcon>
                            <HiOutlineHandThumbUp onClick={() => setReviewType('thumbsUp')} style={{ color: reviewType === 'thumbsUp' ? 'green' : 'grey' }} />
                        </ThumbIcon>
                        <ThumbIcon>
                            <HiOutlineHandThumbDown onClick={() => setReviewType('thumbsDown')} style={{ color: reviewType === 'thumbsDown' ? 'red' : 'grey' }} />
                        </ThumbIcon>
                    </ThumbsContainer>
                    <ReviewInput
                        type="text"
                        placeholder={`Write your review for ${gameDetail.name}`}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        spellCheck="false"
                        required
                    />
                    <PostButton disabled={!isReviewTextValid}>Post</PostButton>
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
        height: "360px",
        borderRadius: "40px",
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
flex-direction: column;
padding: 10px;
align-items: center;
`
const ReviewInput = styled.textarea`
height: 125px;
width: 400px;
background-color: transparent;
border-radius:20px;
border: 1px solid ${COLORS.orange};
transition: all 100ms ease;
font-size: 18px;
padding: 10px;
resize: none;
&:focus {
    outline:none;
    color: white;
}
&::placeholder {
    opacity: 0.3;
    font-weight: bold;
    position: absolute;
    top: 0;
    left: 0;
    color: white;
    font-size: 14px;
    transform: translate(15px, 15px);
}
`
const PostButton = styled.button`
    width: 50%;
    height: 20%;
    margin-top: 15px;
    border-radius: 10px;
    background-color: transparent;
    border: 1px solid ${COLORS.orange};
    color: white;
    font-weight: bold;
    transition: all 100ms ease;
    opacity: 0.5;
    &:hover {
        cursor: pointer;
        opacity: 1;
    }
`
const ThumbIcon = styled.div`
margin-right: 10px;
font-size: 25px;
padding: 5px;
`
const ThumbsContainer = styled.div`
display: flex;
margin-bottom: 5%;
`