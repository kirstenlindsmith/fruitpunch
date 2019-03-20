/* eslint-disable complexity */
import {createStore} from 'redux'
import {gameItems} from './components/utils'

//initial state
const initialState = {
  keypoints: [],
  initialBody: {},
  proportions: {},
  activeGameItems: gameItems
}

//action types
const GOT_KEYPOINTS = 'GOT_KEYPOINTS'
const GOT_INITIALBODY = 'GOT_INITIALBODY'
const GOT_PROPORTIONS = 'GOT_PROPORTIONS'
const KILLED_ITEM = 'KILLED_ITEM'
const REMOVED_ITEM = 'REMOVED_ITEM'

//action creators
export const gotKeypoints = keypoints => {
  return {
    type: GOT_KEYPOINTS,
    keypoints
  }
}

export const gotInitialBody = pose => {
  return {
    type: GOT_INITIALBODY,
    pose
  }
}

export const gotProportions = proportions => {
  return {
    type: GOT_PROPORTIONS,
    proportions
  }
}

export const killedGameItem = gameItem => {
  gameItem.imageUrl = gameItem.explodeUrl
  gameItem.active = false

  return {
    type: KILLED_ITEM,
    gameItem
  }
}

export const removedGameItem = gameItem => {
  gameItem.imageUrl = gameItem.activeUrl
  gameItem.active = true

  return {
    type: REMOVED_ITEM,
    gameItem
  }
}

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_KEYPOINTS:
      return {
        ...state,
        keypoints: action.keypoints
      }
    case GOT_INITIALBODY:
      return {
        ...state,
        initialBody: action.pose
      }
    case GOT_PROPORTIONS:
      return {
        ...state,
        proportions: action.proportions
      }
    case KILLED_ITEM: {
      return {
        ...state,
        activeGameItems: state.activeGameItems.map(item => {
          if (item.id === action.gameItem.id) {
            return action.gameItem
          } else return item
        })
      }
    }
    case REMOVED_ITEM:
      return {
        ...state,
        activeGameItems: [
          ...state.activeGameItems.filter(item => {
            return item.id !== action.gameItem.id
          }),
          action.gameItem
        ]
      }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
