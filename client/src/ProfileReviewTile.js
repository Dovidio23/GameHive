import { styled } from "styled-components"
import { COLORS } from "./GlobalStyles"
import { FiEdit2 } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { useState, useEffect, useRef } from "react"
import { MdDone } from 'react-icons/md';

const MAX_REVIEW_LENGTH = 45

export const ProfileReviewTile = ({ review, user, userId }) => {
    const [truncatedReviewText, setTruncatedReviewText] = useState(review.reviewText)
    const [isEditing, setIsEditing] = useState(false)
    const [editedReviewText, setEditedReviewText] = useState(review.reviewText)
    const [isReviewTextValid, setIsReviewTextValid] = useState(true)
    const [showDoneIcon, setShowDoneIcon] = useState(false);
    const loggedInUserId = localStorage.getItem('userId')
    const addButtonRef = useRef(null)

    const handleEditClick = () => {
        setIsEditing(!isEditing)
    }

    const handleEditSubmit = async () => {
        const endpoint = `/reviews/edit-review`
        try {
            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    reviewId: review.reviewId,
                    userId: user._id,
                    newReviewText: editedReviewText
                })
            })
            if (!response.ok) {
                throw new Error("Failed to update review.")
            }
            setShowDoneIcon(true);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            alert(error.message)
        }
    }


    const handleReviewDelete = async () => {
        try {
            const endpoint = `/reviews/delete-review`
            const response = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    reviewId: review.reviewId,
                    userId: user._id,
                })
            })

            if (!response.ok) {
                throw new Error("Failed to delete review.")
            }
                window.location.reload()
        } catch (error) {
            alert(error.message)
        }
    }

    const handleInputBlur = (event) => {

        if (event.relatedTarget === addButtonRef.current) {
            return
        }
        setEditedReviewText(truncatedReviewText)
        setIsEditing(false)
    }

    const handleTextChanged = (e) => {
        const text = e.target.value
        setEditedReviewText(text)
        setIsReviewTextValid(text.length <= 80)
    }

    useEffect(() => {
        if (review.reviewText.length > MAX_REVIEW_LENGTH) {
            setTruncatedReviewText(review.reviewText.substring(0, MAX_REVIEW_LENGTH) + '...')
        } else {
            setTruncatedReviewText(review.reviewText)
        }
    }, [review.reviewText])

    return (
        <ReviewContainer>
            <Name>{review.name}</Name>
            <Text>
                {isEditing ? (
                    <IsEditingContainer>
                        <StyledInput
                            spellCheck="false"
                            value={editedReviewText}
                            onChange={handleTextChanged}
                            onBlur={handleInputBlur}
                        />
                        <SubmitEditButton
                            ref={addButtonRef}
                            showDone={showDoneIcon}
                            disabled={!isReviewTextValid}
                            onClick={handleEditSubmit}
                        >
                            <Span className="text">+</Span>
                            {showDoneIcon && <MdDone />}
                        </SubmitEditButton>
                    </IsEditingContainer>
                ) : (
                    truncatedReviewText
                )}
            </Text>
            {loggedInUserId === userId && (
                <ActionContainer>
                    <EditIcon onClick={handleEditClick} />
                    <DeleteIcon onClick={handleReviewDelete} />
                </ActionContainer>
            )}
        </ReviewContainer>
    )
}

const ReviewContainer = styled.div`
position: relative;
display: flex;
flex-direction: row;
border: 2px solid ${COLORS.light_grey};
align-items: baseline;
padding: 10px;
border-radius: 20px;
max-width: 80%;
margin-bottom: 10px;
transition: all 200ms ease;
&:hover {
    scale: 1.01;
}
`
const IsEditingContainer = styled.div`
display: flex;
`
const ActionContainer = styled.div`
position: absolute;
top: 50%; 
right: 10px; 
transform: translateY(-50%);
display: flex;
flex-direction: row;
align-items: center;
`
const DeleteIcon = styled(AiOutlineDelete)`
position: relative;
color: red;
opacity: 0.3;
transition: all 200ms ease;
margin-left: 50px;
&:hover {
    opacity: 1;
    scale: 1.03;
    cursor: pointer;
}
`
const EditIcon = styled(FiEdit2)`
position: relative;
color: white;
opacity: 0.3;
transition: all 200ms ease;
&:hover {
    opacity: 1;
    scale: 1.03;
    cursor: pointer;
}
`
const StyledInput = styled.input`
background: transparent;
color: white;
font-size: 15px;
font-weight: bold;
width: 350px;
border: none;
outline: none; 
text-decoration: none;
border-bottom: 2px solid transparent; 
&:focus {
    border-bottom: 2px solid ${COLORS.orange}; 
    border-spacing: 10px;
}
`
const SubmitEditButton = styled.button`
color: white;
background: transparent;
position: relative;
overflow: hidden;
border: none;
opacity: 0.3;
.text, svg {
    transition: opacity 0.3s ease-in-out;
}
.text {
    opacity: ${props => props.showDone ? 0 : 1};
}
svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${props => props.showDone ? 1 : 0};
}
&:hover {
    opacity: 1;
    cursor: pointer;
}
`
const Name = styled.p`
position: relative;
left: 10px;
`
const Text = styled.p`
position:relative;
left: 50px;
`
const Span = styled.span`
font-size:20px;
font-weight: bold;
`

