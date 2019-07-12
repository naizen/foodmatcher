import {
  REQUEST_PLACES,
  RECEIVE_PLACES,
  FAILURE_PLACES,
  ADD_MATCH,
  REMOVE_MATCH,
  REQUEST_PLACE,
  RECEIVE_PLACE
} from '../constants/action-types'
import axios from 'axios'

const yelpApiUrl = process.env.REACT_APP_YELP_API_URL
const corsAnywhere = 'https://cors-anywhere.herokuapp.com'
const baseApiUrl = `${corsAnywhere}/${yelpApiUrl}`

export function requestPlaces() {
  return {
    type: REQUEST_PLACES
  }
}

function requestPlace() {
  return {
    type: REQUEST_PLACE
  }
}

function receivePlaces(payload) {
  return {
    type: RECEIVE_PLACES,
    places: payload
  }
}

function receivePlace(payload) {
  return {
    type: RECEIVE_PLACE,
    place: payload
  }
}

export function fetchPlaces(latitude, longitude) {
  return dispatch => {
    //dispatch(requestPlaces())
    return axios
      .get(`${baseApiUrl}/businesses/search`, {
        params: { latitude, longitude }
      })
      .then(response => dispatch(receivePlaces(response.data.businesses)))
      .catch(error => {
        dispatch({ type: FAILURE_PLACES })
        console.log(error)
      })
  }
}

export function fetchPlace(id) {
  return dispatch => {
    dispatch(requestPlace())
    return axios
      .get(`${baseApiUrl}/businesses/${id}`)
      .then(response => dispatch(receivePlace(response.data)))
      .catch(error => console.log(error))
  }
}

export function addMatch(match) {
  const newMatch = {
    id: match.id,
    name: match.name,
    image_url: match.image_url,
    categories: match.categories,
    location: match.location,
    rating: match.rating,
    review_count: match.review_count,
    url: match.url
  }

  let existingMatch = null

  if (localStorage.matches) {
    const prevMatches = JSON.parse(localStorage.matches)
    existingMatch = prevMatches.find(match => {
      return match.id === newMatch.id
    })
    if (!existingMatch) {
      localStorage.matches = JSON.stringify([...prevMatches, newMatch])
    }
  } else {
    localStorage.matches = JSON.stringify([newMatch])
  }

  return {
    type: ADD_MATCH,
    match: existingMatch ? null : match
  }
}

export function removeMatch(match) {
  if (localStorage.matches) {
    const matches = JSON.parse(localStorage.matches)
    localStorage.matches = JSON.stringify(
      matches.filter(m => m.id !== match.id)
    )
  }

  return {
    type: REMOVE_MATCH,
    match
  }
}
