import { createGlobalStyle } from 'styled-components';

export const COLORS = {
    dark_grey: "#181A1E",
    light_grey: "#2D2F33",
    orange: '#FF5842'
}

export const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap');

    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: 'Didact Gothic', sans-serif;
        color: #FAFAFA;
        background-color: ${COLORS.dark_grey};
    }

    #root {
    }
`

