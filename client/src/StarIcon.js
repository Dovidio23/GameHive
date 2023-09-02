import { styled } from "styled-components";
import { FaRegStar, FaStar } from "react-icons/fa";
import {isLoggedIn }  from "./Utility";


const StarIcon = styled(FaRegStar)`
color: gray;
transition: color 0.2s ease;
`

const FilledStarIcon = styled(FaStar)`
color: yellow;
transition: color 0.2s ease;
`

const StarContainer = styled.div`
cursor: pointer;
`

export const StarComponent = ({ isFavorite, onStarClick, }) => {
    const clickable = isLoggedIn()

    return (
        <StarContainer isClickable={clickable} onClick={clickable ? onStarClick : null}>
            {isFavorite ? (
                <FilledStarIcon />
            ) : (
                <StarIcon />
            )}
        </StarContainer>
    );
};

