import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import FastfoodIcon from '@material-ui/icons/Fastfood'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import Sidebar from './containers/Sidebar'
import Places from './containers/Places'
import PlaceDetail from './containers/PlaceDetail'
import './App.css'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#fc556b' }
  }
})

function App() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showBackdrop, setShowBackdrop] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(min-width: 769px)').matches) {
      setShowSidebar(true)
    } else {
      setShowSidebar(false)
    }
  }, [])

  const toggleSideBar = () => {
    setShowSidebar(!showSidebar)
    if (window.matchMedia('(max-width: 768px)').matches && !showSidebar) {
      setShowBackdrop(true)
    }
  }

  const onHideSidebar = () => {
    setShowSidebar(false)
    setShowBackdrop(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app-container">
          <Sidebar showSidebar={showSidebar} onHideSidebar={onHideSidebar} />
          <div className="mobile-navbar">
            <IconButton onClick={toggleSideBar}>
              <MenuIcon style={{ fontSize: 40 }} />
            </IconButton>
            <Link to="/">
              <FastfoodIcon
                style={{ fontSize: 40 }}
                component={svgProps => {
                  return (
                    <svg {...svgProps}>
                      <defs>
                        <linearGradient id="gradient1">
                          <stop offset="30%" stopColor="#FE6B8B" />
                          <stop offset="90%" stopColor="#FF8E53" />
                        </linearGradient>
                      </defs>
                      {React.cloneElement(svgProps.children[0], {
                        fill: 'url(#gradient1)'
                      })}
                    </svg>
                  )
                }}
              />
            </Link>
            <IconButton>
              {/* Placeholder for now */}
              <MenuIcon style={{ fontSize: 40, visibility: 'hidden' }} />
            </IconButton>
          </div>
          <main className="main">
            <Route path="/" exact component={Places} />
            <Route path="/place/:id" component={PlaceDetail} />
          </main>
        </div>
        <div
          className="backdrop"
          onClick={onHideSidebar}
          style={{ display: `${showBackdrop ? 'block' : 'none'}` }}
        />
      </Router>
    </ThemeProvider>
  )
}

export default App
