import React from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import GlobalStyle from './styles/global-style'
import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from './styles/theme'
import ParticlesConfig from './config/particle-config'
import useDarkTheme from './config/useDarkTheme'
import Loading from './config/Loading'
import axios from 'axios'

axios.defaults.withCredentials = true

const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Landing = lazy(() => import('./pages/Landing'))
const DrawDream = lazy(() => import('./pages/DrawDream'))
const SearchDream = lazy(() => import('./pages/SearchDream'))
const MyPage = lazy(() => import('./pages/MyPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Header = lazy(() => import('./components/Header'))

function App(): JSX.Element {
  const { theme, themeToggler } = useDarkTheme()
  const selectedTheme = theme === 'light' ? lightTheme : darkTheme

  return (
    <>
      <ThemeProvider theme={selectedTheme}>
        <GlobalStyle />
        <Router>
          <Suspense fallback={<Loading></Loading>}>
            <Header themeToggler={themeToggler} t={theme} />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/searchdream" component={SearchDream} />
              <Route path="/drawdream" component={DrawDream} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <Route path="/mypage" component={MyPage} />
              <Route path="*" component={NotFound} />
            </Switch>
            <ParticlesConfig t={theme} />
          </Suspense>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
