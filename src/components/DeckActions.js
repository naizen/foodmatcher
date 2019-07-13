import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from '@material-ui/icons/Refresh'
import CloseIcon from '@material-ui/icons/Close'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { red, teal, orange } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
  iconButton: {
    '&:hover': {
      backgroundColor: 'white'
    }
  },
  refreshIcon: {
    color: orange['A400']
  },
  nopeIcon: {
    fontSize: 38,
    color: red['A400']
  },
  likeIcon: {
    fontSize: 38,
    color: teal['A400']
  }
}))

function DeckActions({ refresh, swipeCard, current }) {
  const classes = useStyles()

  return (
    <div className="deck-actions">
      <IconButton onClick={() => refresh()} className={classes.iconButton}>
        <RefreshIcon className={classes.refreshIcon} fontSize="large" />
      </IconButton>
      <IconButton
        onClick={() => swipeCard(current, -1)}
        className={classes.iconButton}
      >
        <CloseIcon className={classes.nopeIcon} />
      </IconButton>
      <IconButton
        onClick={() => swipeCard(current, 1)}
        className={classes.iconButton}
      >
        <FavoriteIcon className={classes.likeIcon} />
      </IconButton>
    </div>
  )
}

export default DeckActions
