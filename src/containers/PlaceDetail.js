import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DirectionsIcon from '@material-ui/icons/Directions'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { fetchPlace, addMatch, removeMatch } from '../actions'
import { getFormattedTime, getDayOfWeek } from '../utils'
import ReviewStars from '../components/ReviewStars'
import PlaceMap from '../components/PlaceMap'
import { teal } from '@material-ui/core/colors'

function PlaceDetail({ dispatch, match, isFetching, place, isPlaceMatch }) {
  const [placeId, setPlaceId] = useState('')

  useEffect(() => {
    if (placeId !== match.params.id) {
      setPlaceId(match.params.id)
      dispatch(fetchPlace(match.params.id))
    }
  }, [dispatch, match, placeId])

  const toggleMatch = () => {
    if (isPlaceMatch) {
      dispatch(removeMatch(place))
    } else {
      dispatch(addMatch(place))
    }
  }

  return (
    <Grid className="place-detail" container spacing={4}>
      {Object.keys(place).length && !isFetching ? (
        <>
          <Grid item xs={12} sm={6}>
            <Card className="place-detail-card">
              <CardHeader title={place.name} />
              <CardMedia
                style={{ height: 300 }}
                image={place.image_url}
                title={place.name}
              />
              <CardContent>
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
                <p>
                  {place.location.address1}
                  <br />
                  {place.location.city}, {place.location.state}
                  <br />
                  {place.display_phone}
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>Hours</th>
                      <th style={{ textAlign: 'right' }}>
                        <span
                          className={`${
                            place.hours[0].is_open_now ? 'success' : 'danger'
                          }`}>
                          {place.hours[0].is_open_now
                            ? 'OPEN NOW'
                            : 'CLOSED NOW'}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {place.hours[0].open.map((openAt, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 'bold' }}>
                          {getDayOfWeek(openAt.day)}
                        </td>
                        <td>
                          {getFormattedTime(openAt.start)} -{' '}
                          {getFormattedTime(openAt.end)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
              <CardActions disableSpacing>
                <Tooltip
                  placement="top"
                  title={`${isPlaceMatch ? 'Remove match' : 'Add match'}`}>
                  <IconButton
                    style={{ marginLeft: 'auto' }}
                    onClick={() => toggleMatch()}
                    aria-label={`${
                      isPlaceMatch ? 'Remove match' : 'Add match'
                    }`}>
                    {isPlaceMatch ? (
                      <FavoriteIcon
                        style={{ color: teal['A400'] }}
                        fontSize="large"
                      />
                    ) : (
                      <FavoriteBorderIcon fontSize="large" />
                    )}
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PlaceMap
              isMarkerShown
              lat={place.coordinates.latitude}
              lng={place.coordinates.longitude}
            />
            <div className="map-actions">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
                  place.name +
                    ' ' +
                    place.location.address1 +
                    ' ' +
                    place.location.city +
                    ' ' +
                    place.location.state
                )}`}
                target="_blank"
                rel="noopener noreferrer">
                <DirectionsIcon /> Get Directions
              </a>
            </div>
          </Grid>
        </>
      ) : null}
    </Grid>
  )
}

function mapStateToProps(state) {
  const place = state.placeDetail.place
  let isPlaceMatch = false
  isPlaceMatch = state.matches.find(match => {
    return match.id === place.id
  })

  return {
    isFetching: state.placeDetail.isFetching,
    place,
    isPlaceMatch
  }
}

export default connect(mapStateToProps)(PlaceDetail)
