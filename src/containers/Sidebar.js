import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ListSubheader from '@material-ui/core/ListSubheader'
import FastfoodIcon from '@material-ui/icons/Fastfood'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '60px 0 30px 0',
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%'
  },
  gridList: {
    padding: '5px 15px'
  },
  tile: {
    cursor: 'pointer',
    borderRadius: 4
  }
}))

function Sidebar({ matches, location, history, showSidebar, onHideSidebar }) {
  const classes = useStyles()
  const [prevLocation, setPrevLocation] = useState('')

  useEffect(() => {
    if (prevLocation !== location.pathname) {
      setPrevLocation(location.pathname)
      if (window.matchMedia('(max-width: 768px)').matches) {
        onHideSidebar()
      }
    }
  }, [prevLocation, location, onHideSidebar])

  const onPlaceClick = place => {
    history.push(`/place/${place.id}`)
  }

  return (
    <aside
      className="sidebar"
      style={{ display: `${showSidebar ? 'block' : 'none'}` }}>
      <AppBar position="absolute" elevation={2}>
        <p className="appbar-title">
          <Link to="/">
            <FastfoodIcon /> FoodMatcher
          </Link>
        </p>
      </AppBar>
      <div className={classes.root}>
        <GridList className={classes.gridList} spacing={15}>
          <GridListTile
            key="Subheader"
            cols={2}
            style={{ height: 'auto', paddingBottom: 0 }}>
            <ListSubheader component="div" style={{ padding: 0 }}>
              Matches
            </ListSubheader>
          </GridListTile>
          {matches.length > 0 ? (
            matches.map(place => (
              <GridListTile
                onClick={() => onPlaceClick(place)}
                key={place.id}
                classes={{ tile: classes.tile }}>
                <img src={place.image_url} alt={place.name} />
                <GridListTileBar title={place.name} />
              </GridListTile>
            ))
          ) : (
            <div style={{ opacity: 0.4 }}>No matches yet</div>
          )}
        </GridList>
      </div>
    </aside>
  )
}

const mapStateToProps = state => ({
  matches: state.matches
})

export default withRouter(connect(mapStateToProps)(Sidebar))
