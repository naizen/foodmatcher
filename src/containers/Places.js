import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Deck from '../components/Deck'
import {
  requestPlaces,
  fetchPlaces,
  addMatch,
  removeMatch,
  failurePlaces
} from '../actions'
import { ReactComponent as LoaderSvg } from '../assets/puff.svg'
import ErrorIcon from '@material-ui/icons/Error'

class Places extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(requestPlaces())
    // Check for Geolocation API permissions
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        dispatch(fetchPlaces(lat, lng))
      },
      err => {
        dispatch(
          failurePlaces(
            'Location permission denied. You need to enable location sharing in your browser settings to use FoodMatcher.'
          )
        )
      }
    )
  }

  handleAddMatch = place => {
    this.props.dispatch(addMatch(place))
  }

  handleRemoveMatch = place => {
    this.props.dispatch(removeMatch(place))
  }

  render() {
    const { places, isFetching, error } = this.props

    return (
      <Fragment>
        {isFetching && places.length === 0 && (
          <div className="deck-loader">
            <LoaderSvg />
            <p>Locating places near you...</p>
          </div>
        )}
        {!isFetching && error && (
          <div className="deck-loader error-message">
            <ErrorIcon style={{ stroke: 'none', color: 'rgba(0,0,0,0.2)' }} />
            <p>{error}</p>
          </div>
        )}
        {places.length > 0 ? (
          <Deck
            places={places}
            addMatch={this.handleAddMatch}
            removeMatch={this.handleRemoveMatch}
          />
        ) : null}
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { places } = state
  const { isFetching, items, error } = places
  return {
    isFetching,
    places: items,
    error
  }
}

export default connect(mapStateToProps)(Places)
