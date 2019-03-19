import {createStore} from 'redux'

//initial state
const initialState = {
  keypoints: [],
  initialBody: {},
  proportions: {},
  activeGameItems: [
    {
      id: 1,
      imageUrl: 'assets/strawberry.gif',
      x: 200,
      y: 200
    }
  ],
  hiddenGameItems: []
}

//action types
const GOT_KEYPOINTS = 'GOT_KEYPOINTS'
const GOT_INITIALBODY = 'GOT_INITIALBODY'
const GOT_PROPORTIONS = 'GOT_PROPORTIONS'
const REMOVED_ITEM = 'REMOVED_ITEM'
const RESTART = 'RESTART'

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

export const removedGameItem = gameItem => {
  return {
    type: REMOVED_ITEM,
    gameItem
  }
}

export const restartItems = () => {
  return {
    type: RESTART
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
    case REMOVED_ITEM:
      return {
        ...state,
        activeGameItems: [
          state.activeGameItems.filter(obj => obj.id !== action.gameItem.id)
        ],
        hiddenGameItems: [...state.hiddenGameItems, action.gameItem]
      }
    case RESTART:
      return {
        ...state,
        activeGameItems: [...state.hiddenGameItems],
        hiddenGameItems: []
      }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
