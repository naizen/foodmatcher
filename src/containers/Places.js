import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Deck from '../components/Deck'
import { requestPlaces, fetchPlaces, addMatch, removeMatch } from '../actions'
import { ReactComponent as LoaderSvg } from '../assets/puff.svg'

class Places extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(requestPlaces())
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      dispatch(fetchPlaces(lat, lng))
    })
  }

  handleAddMatch = place => {
    this.props.dispatch(addMatch(place))
  }

  handleRemoveMatch = place => {
    this.props.dispatch(removeMatch(place))
  }

  render() {
    const { places, isFetching } = this.props

    return (
      <Fragment>
        {isFetching && places.length === 0 && (
          <div className="deck-loader">
            <LoaderSvg />
            <p>Locating places near you...</p>
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
  const { isFetching, items } = places
  return {
    isFetching,
    places: items
  }
}

export default connect(mapStateToProps)(Places)
