import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'
import axios from 'axios'

const apiKey = process.env.REACT_APP_YELP_API_KEY
axios.defaults.headers.common['Authorization'] = 'Bearer ' + apiKey

const loggerMiddleware = createLogger()

function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  )
}

const store = configureStore()

export default store
