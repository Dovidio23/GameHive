import React from 'react'
import { GlobalStyle } from './GlobalStyles'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from './NavBar'
import { styled } from 'styled-components'
import { LandingPage } from './LandingPage'
import { GamePage } from './GamePage'
import { ProfilePage } from './ProfilePage'
import { GameDetailPage } from './GameDetailPage'
import { UserProvider } from './UserContext'
import { setupTokenExpirationCheck } from './Utility'
import { useEffect } from 'react'

const App = () => {
  useEffect(setupTokenExpirationCheck, [])

  return (
    <AppContainer>
      <UserProvider>
      <BrowserRouter>
        <Container>
          <GlobalStyle />
          <NavBar />
            <RouteContainer>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gamepage" element={<GamePage />} />
            <Route path="/user/:userId" element={<ProfilePage />} />
            <Route path="/game/:gameId" element={<GameDetailPage />} />
          </Routes>
            </RouteContainer>
        </Container>
      </BrowserRouter>
      </UserProvider>
    </AppContainer>
  )
}
const Container = styled.div`
margin-left: 80px;
margin-right: 80px;

`
const AppContainer = styled.div`
`
const RouteContainer = styled.div`
margin-top:100px;
`
export default App
