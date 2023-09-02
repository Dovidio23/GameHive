import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { GameTile } from './GameTile'
import { COLORS } from './GlobalStyles'
import { AiOutlineTrophy } from 'react-icons/ai'
import { ImFire } from 'react-icons/im'
import { BsCalendar3 } from 'react-icons/bs'


export const GamePage = ({ userFavorites }) => {
    const [games, setGames] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(12)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedGenre, setSelectedGenre] = useState('All')
    const [currentMode, setCurrentMode] = useState('default')
    const [isFirstLoad, setIsFirstLoad] = useState(true)

    const [genres, setGenres] = useState([])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentGames = games.slice(indexOfFirstItem, indexOfLastItem)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(`https://api.rawg.io/api/genres?key=0a56a388bb1348fcb30500ac14ad5534`)
                const data = await response.json()
                setGenres(data.results)
            } catch (error) {
                console.error(error)
            }
        }
        fetchGenres()
    }, [])

    const searchGames = async () => {
        let apiUrl = `https://api.rawg.io/api/games?key=0a56a388bb1348fcb30500ac14ad5534&page_size=100&search=${searchQuery}`

        try {
            const response = await fetch(apiUrl)
            const data = await response.json()
            setGames(data.results)
            setCurrentPage(1)
            setCurrentMode('Search')
        } catch (error) {
            console.log(error)
        }
    }

    const FetchTop100GamesEver = async (genre = 'All') => {
        try {
            let apiUrl = `https://api.rawg.io/api/games?key=0a56a388bb1348fcb30500ac14ad5534&ordering=-added&page_size=100`
            if (genre !== 'All') apiUrl += `&genres=${genre}`
            const response = await fetch(apiUrl);
            const data = await response.json();
            setGames(data.results);
            setCurrentPage(1);
            setCurrentMode('Top100')
        } catch (error) {
            console.log(error);
        }
    }

    const FetchTrendingGames = async (year = selectedYear, genre = selectedGenre) => {
        try {
            let apiUrl = `https://api.rawg.io/api/games?key=0a56a388bb1348fcb30500ac14ad5534&ordering=-added&page_size=100&trending=true&dates=${year}-01-01,${year}-12-31`
            if (genre !== 'All') apiUrl += `&genres=${genre}`

            const response = await fetch(apiUrl)
            const data = await response.json()
            setGames(data.results)
            setCurrentPage(1)
            setCurrentMode('Trending')
        } catch (error) {
            console.log(error)
        }
    }

    const FetchNewReleases = async () => {
        try {
            const response = await fetch(`https://api.rawg.io/api/games?key=0a56a388bb1348fcb30500ac14ad5534&dates=${formattedStartDate},${formattedEndDate}&ordering=-released&page_size=100`)
            const data = await response.json()
            setGames(data.results)
            setCurrentPage(1)
            setCurrentMode('New Releases')
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (isFirstLoad) {
            FetchTop100GamesEver()
            setIsFirstLoad(false)
        }
        else if (currentMode === 'Top100') {
            FetchTop100GamesEver(selectedGenre, currentMode)
        }
    }, [selectedGenre])

    useEffect(() => {
        if (currentMode === 'Trending') {
            FetchTrendingGames(selectedYear, selectedGenre)
        }
    }, [selectedYear, selectedGenre])


    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 30)

    const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;


    return (
        <Page >
            <div>
                <div>
                    <StyledInput
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search games....'
                    />
                    <button onClick={searchGames}>Signup</button>
                </div>
                <Bar>
                    <button
                        onClick={() => {
                            setCurrentMode('Top100')
                            setSelectedGenre('All');
                            FetchTop100GamesEver('All');
                        }
                        }
                        data-active={currentMode === 'Top100' ? 'true' : 'false'}
                    >
                        <AiOutlineTrophy /> Top100
                    </button>
                    <button
                        onClick={() => {
                            setSelectedGenre('All');
                            setSelectedYear(new Date().getFullYear());
                            FetchTrendingGames(new Date().getFullYear(), 'All');
                        }}
                        data-active={currentMode === 'Trending' ? 'true' : 'false'}
                    >
                        <ImFire /> Trending
                    </button>
                    <button
                        onClick={FetchNewReleases}
                        data-active={currentMode === 'New Releases' ? 'true' : 'false'}
                    >
                        <BsCalendar3 /> New Releases
                    </button>
                </Bar>

                <DropdownContainer>
                    <GenreDropdown>
                        <label>Select Genre:</label>
                        <StyledSelect value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                            <StyledOption value="All">All</StyledOption>
                            {genres.map((genre) => (
                                <StyledOption key={genre.id} value={genre.slug}>{genre.name}</StyledOption>
                            ))}
                        </StyledSelect>
                    </GenreDropdown>
                    {currentMode === 'Trending' && (
                        <TrendingDropdown>
                            <label>Select Year:</label>
                            <StyledSelect value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                {[...Array(10)].map((_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <StyledOption key={year} value={year}>{year}</StyledOption>;
                                })}
                            </StyledSelect>
                        </TrendingDropdown>
                    )}
                </DropdownContainer>
                <GamepageContainer>
                    {currentGames.map((game) => (
                        <div >
                            {<GameTile game={game} userFavorites={userFavorites} />}
                        </div>
                    ))}
                </GamepageContainer>
                <Pagination>
                    {Array.from({ length: Math.ceil(games.length / itemsPerPage) }, (_, index) => (
                        <PageNumber
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            active={currentPage === index + 1}
                        >
                            {index + 1}
                        </PageNumber>
                    ))}
                </Pagination>
            </div>
        </Page>
    )
}

const Page = styled.div`
display: flex;
flex-direction: column;
align-items: center;
min-height: 100vh;

`
const Bar = styled.div`
font-family: 'Didact Gothic', sans-serif;
display: flex;
flex-direction: row;
width: 60%;
align-items: baseline;
justify-content: space-between;
& button {
    font-size: 20px;
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.3s ease;
    &[data-active="true"] {
            color: ${COLORS.orange}; 
        }
    }
    `

const DropdownContainer = styled.div`
    display: flex;
    padding: 8px;
    `
const GamepageContainer = styled.div`
    margin-top: 10px;
    display: grid;
    grid-template-rows: 200px 200px 200px;
    grid-template-columns: 350px 350px 350px 350px;
    grid-gap: 25px;
    text-align: center;
    justify-content: center;
    align-items: center;
    `
const StyledInput = styled.input`
background: transparent;
border: 1px solid ${COLORS.light_grey};
min-width:600px;
height:40px;
border-radius: 20px;
color: white;
outline: none;
padding: 3px;
font-size: 18px;
margin-bottom: 20px;
`
const StyledSelect = styled.select`
background-color: ${COLORS.dark_grey};
color: white;
font-weight: bold;
padding: 8px;
margin: 4px;
border: none;
opacity: 0.5;
border-radius: 5px;
cursor: pointer;
transition: all 200ms ease;
&:hover {
    opacity: 1;
}
&:focus {
    opacity: 1;
}
`
const TrendingDropdown = styled.div`
margin-left: 10px;
align-items: center;
`
const StyledOption = styled.option`

`
const GenreDropdown = styled.div`
`
const Pagination = styled.div`
    display: flex;
    justify-content: center;
`

const PageNumber = styled.div`
    margin: 10px 8px;
    cursor: pointer;
    transition: all 100ms ease;
    &:hover {
        scale: 1.1;
        color: ${COLORS.orange};
    }
`