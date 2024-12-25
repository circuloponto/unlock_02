import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    font-size: 16px;
    overflow: hidden;
    overscroll-behavior: none;
    height: 100%;
  }

  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
    touch-action: none;
    -webkit-overflow-scrolling: none;
    overscroll-behavior: none;
    background-color: #fff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    color: white;
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyles;
