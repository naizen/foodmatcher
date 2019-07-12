import React from 'react'
import { withRouter } from 'react-router-dom'
import { animated, interpolate, useTransition } from 'react-spring'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MarkerIcon from '@material-ui/icons/Place'
import InfoIcon from '@material-ui/icons/Info'
import ReviewStars from './ReviewStars'

// Convert distance in meters to miles
const toMiles = distance => {
  const yards = distance * 1.0936
  const miles = yards / 1760
  return miles.toFixed(1)
}

const useStyles = makeStyles(theme => ({
  infoButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    color: 'rgba(255,255,255,0.8)'
  }
}))

function Card({
  x,
  bind,
  rot,
  scale,
  trans,
  shadow,
  place,
  swipeDelta,
  isCurrent,
  history
}) {
  const classes = useStyles()
  const swipeLeftTransition = useTransition(
    swipeDelta < 0 && isCurrent ? true : false,
    null,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 }
    }
  )

  const swipeRightTransition = useTransition(
    swipeDelta > 0 && isCurrent ? true : false,
    null,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 }
    }
  )

  const onInfoClick = () => {
    history.push(`/place/${place.id}`)
  }

  return (
    <animated.div
      className="card"
      {...bind}
      style={{
        transform: interpolate([rot, scale], trans),
        backgroundImage: `url(${place.image_url})`,
        boxShadow: shadow.interpolate(
          s => `0 ${s * 2}px ${s * 10}px 0 rgba(155,155,155,0.77)`
        )
      }}>
      <div className="card-overlay" />
      <div className="card-details">
        <h2>{place.name}</h2>
        <ReviewStars
          rating={place.rating}
          reviewCount={place.review_count}
          yelpUrl={place.url}
        />
        <p>
          {place.categories.map((category, i) => (
            <span key={category.alias}>
              {category.title}
              {i === place.categories.length - 1 ? '' : ', '}
            </span>
          ))}
        </p>
        <p style={{ marginTop: 10 }}>
          <MarkerIcon
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              marginRight: 5
            }}
          />
          <span style={{ verticalAlign: 'middle' }}>
            {toMiles(place.distance)} miles away
          </span>
        </p>
        <IconButton
          onClick={() => onInfoClick()}
          className={classes.infoButton}>
          <InfoIcon fontSize="large" />
        </IconButton>
      </div>
      {swipeLeftTransition.map(
        ({ item, key, props }) =>
          item && (
            <animated.div className="stamp-nope" key={key} style={props}>
              NOPE
            </animated.div>
          )
      )}
      {swipeRightTransition.map(
        ({ item, key, props }) =>
          item && (
            <animated.div className="stamp-like" key={key} style={props}>
              LIKE
            </animated.div>
          )
      )}
    </animated.div>
  )
}

export default withRouter(Card)
