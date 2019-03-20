import {createStore} from 'redux'

//initial state
const initialState = {
  keypoints: [],
  initialBody: {},
  proportions: {},
  activeGameItems: [
    {
      id: 1,
      type: 'strawberry',
      imageUrl: 'assets/strawberry.gif',
      x: 200,
      y: 200,
      width: 100
    },
    {
      id: 2,
      type: 'banana',
      imageUrl: 'assets/banana.gif',
      x: 400,
      y: 400,
      width: 100
    }
  ],
  hiddenGameItems: []
}

//action types
const GOT_KEYPOINTS = 'GOT_KEYPOINTS'
const GOT_INITIALBODY = 'GOT_INITIALBODY'
const GOT_PROPORTIONS = 'GOT_PROPORTIONS'
const KILLED_ITEM = 'KILLED_ITEM'
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

export const killedGameItem = gameItem => {
  return {
    type: KILLED_ITEM,
    gameItem
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
    case KILLED_ITEM: {
      if (action.gameItem.imageUrl !== '/assets/explodeRED.gif') {
        return {
          ...state,
          activeGameItems: state.activeGameItems.map(obj => {
            if (obj.id === action.gameItem.id) {
              if (obj.type === 'strawberry') {
                return {
                  id: obj.id,
                  imageUrl: '/assets/explodeRED.gif',
                  x: obj.x,
                  y: obj.y,
                  width: obj.width
                }
              } else if (obj.type === 'banana') {
                return {
                  id: obj.id,
                  imageUrl: '/assets/explodeYELLOW.gif',
                  x: obj.x,
                  y: obj.y,
                  width: obj.width
                }
              }
            } else return obj
          })
        }
      } else return state
    }
    case REMOVED_ITEM:
      return {
        ...state,
        activeGameItems: state.activeGameItems.filter(obj => {
          return obj.id !== action.gameItem.id
        }),
        hiddenGameItems: [...state.hiddenGameItems, action.gameItem]
      }
    case RESTART:
      return {
        ...state,
        activeGameItems: [...initialState.activeGameItems],
        hiddenGameItems: []
      }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
