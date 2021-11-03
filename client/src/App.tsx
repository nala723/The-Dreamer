import React from 'react';
import './App.css';
import GlobalStyle from './styles/global-style';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './styles/theme';

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyle />
        <div className="App">dd하하하호호안녕하세요</div>
      </ThemeProvider>
    </>
  );
}

export default App;
