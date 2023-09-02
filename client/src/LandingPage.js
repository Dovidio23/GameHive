import styled from "styled-components"
import img1 from './assets/112.png'
import { GameTile } from "./GameTile"
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { COLORS } from "./GlobalStyles"





export const LandingPage = () => {
    const [trendingGames, setTrendingGames] = useState([])
    const navigate = useNavigate()

    const handleGetStartedClick = () => {
        navigate(`/login`)
    }

    const handleTrendingButtonClick = () => {
        navigate('/gamepage')
    }

    useEffect(() => {
        const fetchTrendingGames = async () => {
            try {
                const response = await fetch('https://api.rawg.io/api/games?key=0a56a388bb1348fcb30500ac14ad5534&ordering=-added&page_size=4')
                const data = await response.json()
                setTrendingGames(data.results)
            } catch (error) {
                console.log(error)
            }
        }
        fetchTrendingGames()
    }, [])

    return (
        <BigContainer>
            <Hero>
                <TitleContainer>
                    <Title>Explore a vast library of trending games! </Title>
                    <P> From action-packed shooters to captivating RPGs, and everything in between. Stay up-to-date with the latest gaming news, reviews, and updates, as we bring you the pulse of the gaming industry.</P>
                </TitleContainer>
                <LandingImageContainer>
                    <LandingImage src={img1} alt="Landing Page" />
                    <Button onClick={handleGetStartedClick}>Get started now!</Button>
                </LandingImageContainer>
            </Hero>
            <CurrentlyTrending>
                <Trending>Most popular</Trending>
                <SearchBarContainer>
                    
                    <TrendingButton onClick={handleTrendingButtonClick}>See all</TrendingButton>
                </SearchBarContainer>
            </CurrentlyTrending>
            <Games>
                {trendingGames.map((game) => (
                    <GameTile game={game} />
                ))}
            </Games>
        </BigContainer>
    )
}


const BigContainer = styled.div`
`
const TitleContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
margin-right: 30px;
margin-top: -50px;
`
const P = styled.p`
color: #9a9da1;
margin-top: -30px;
margin-right: 40px;
`
const Title = styled.h1`
font-size: 75px;
`
const Hero = styled.div`
display: flex;
margin-top: 80px;
justify-content: space-between;
margin-top: 100px;
`
const LandingImage = styled.img`
width: 800px;
height: 600px;
border-radius: 15px;
`
const LandingImageContainer = styled.div`
position: relative;
`
const Button = styled.button`
color:white;
position: absolute;
bottom: 20px;
right: 20px;
background: transparent;
border: none;
font-size: 20px;
cursor: pointer;
outline: 1px solid ${COLORS.light_grey};
border-radius:20px;
padding: 8px;
transition: all 200ms ease;
&:hover{
    color: ${COLORS.orange}
}
`
const Div = styled.div`
font-weight: bold;
font-size: 24px;
margin-top: 50px;
margin-left: 300px;
margin-right: 300px;
text-align: center;
`
const CurrentlyTrending = styled.div`
display: flex;
justify-content: space-between;
align-items: baseline;
padding: 8px;
`
const TrendingButton = styled.button`
background: transparent;
border: 1px solid ${COLORS.orange};
border-radius: 15px;
height: 30px;
width: 100px;
color: white;
font-weight:bold;
margin-left: 30px;
cursor: pointer;
`
const Games = styled.div`
display: flex;
justify-content: space-between;
margin-top: 10px;
`
const Trending = styled.h1`

`
const SearchBarContainer = styled.div`
display: flex;
`