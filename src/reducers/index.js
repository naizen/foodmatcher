import { combineReducers } from 'redux'
import {
  REQUEST_PLACES,
  RECEIVE_PLACES,
  FAILURE_PLACES,
  REQUEST_PLACE,
  RECEIVE_PLACE,
  ADD_MATCH,
  REMOVE_MATCH
} from '../constants/action-types'

function places(state = { isFetching: false, items: [] }, action) {
  switch (action.type) {
    case REQUEST_PLACES:
      return { ...state, isFetching: true }
    case RECEIVE_PLACES:
      return { ...state, isFetching: false, items: action.places }
    case FAILURE_PLACES:
      return { ...state, isFetching: false }
    default:
      return state
  }
}

function placeDetail(state = { isFetching: false, place: {} }, action) {
  switch (action.type) {
    case REQUEST_PLACE:
      return { ...state, isFetching: true }
    case RECEIVE_PLACE:
      return { ...state, isFetching: false, place: action.place }
    default:
      return state
  }
}

const initialMatches = localStorage.matches
  ? JSON.parse(localStorage.matches)
  : []

function matches(state = initialMatches, action) {
  switch (action.type) {
    case ADD_MATCH:
      return action.match ? [...state, action.match] : state
    case REMOVE_MATCH:
      return state.filter(match => match.id !== action.match.id)
    default:
      return state
  }
}

const rootReducer = combineReducers({ places, placeDetail, matches })

export default rootReducer
