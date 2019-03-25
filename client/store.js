/* eslint-disable complexity */
import {createStore, applyMiddleware} from 'redux'
import axios from 'axios'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {
  gameItems,
  generateRandomCoords,
  bomb,
  shuffle
} from './components/utils'

//initial state
const initialState = {
  keypoints: [],
  initialBody: {},
  proportions: {},
  activeGameItems: gameItems,
  riskyGameItems: [...gameItems, bomb],
  gameStarted: false,
  canvasContext: [],
  leaderboard: [],
  finalScore: 0
}

//action types
const GOT_KEYPOINTS = 'GOT_KEYPOINTS'
const GOT_INITIALBODY = 'GOT_INITIALBODY'
const GOT_PROPORTIONS = 'GOT_PROPORTIONS'
const KILLED_ITEM = 'KILLED_ITEM'
const REMOVED_ITEM = 'REMOVED_ITEM'
const GAME_STARTED = 'GAME_STARTED'
const GAME_FINISHED = 'GAME_FINISHED'
const GOT_CANVAS_CONTEXT = 'GOT_CANVAS_CONTEXT'
const GOT_LEADERBOARD = 'GOT_LEADERBOARD'
const GOT_SCORE = 'GOT_SCORE'
const ADDED_BOMB = 'ADDED_BOMB'
const REMOVED_BOMBS = 'REMOVED_BOMBS'
const KILLED_BOMB = 'KILLED_BOMB'
const RETIRED_BOMB = 'RETIRED_BOMB'

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
  const newCoords = generateRandomCoords(gameItem)
  gameItem.x = newCoords.x
  gameItem.y = newCoords.y

  return {
    type: REMOVED_ITEM,
    gameItem
  }
}

export const gameStarted = () => {
  return {
    type: GAME_STARTED
  }
}

export const gameFinished = () => {
  return {
    type: GAME_FINISHED
  }
}

export const gotCanvasContext = canvas => {
  return {
    type: GOT_CANVAS_CONTEXT,
    canvas
  }
}

export const gotLeaderboard = leaderboard => {
  return {
    type: GOT_LEADERBOARD,
    leaderboard
  }
}

export const loadLeaderboard = () => {
  return async dispatch => {
    try {
      const {data: leaderboard} = await axios.get('/api/score/topten')
      dispatch(gotLeaderboard(leaderboard))
    } catch (err) {
      console.log(err)
    }
  }
}

export const gotScore = finalScore => {
  return {
    type: GOT_SCORE,
    finalScore
  }
}

export const sendScore = (name, score) => {
  return async dispatch => {
    try {
      console.log('NAME', name, 'SCORE', score)
      await axios.post('/api/score/addtoboard', {name, score})
      dispatch(loadLeaderboard())
    } catch (err) {
      console.error(err)
    }
  }  
}    

export const addedBomb = () => {
  const newBomb = bomb
  if (newBomb.id >= 9) newBomb.id++
  const newCoords = generateRandomCoords(newBomb)
  newBomb.x = newCoords.x
  newBomb.y = newCoords.y

  return {
    type: ADDED_BOMB,
    newBomb
  }
}

export const retiredBomb = gameItem => {
  gameItem.imageUrl = gameItem.activeUrl
  gameItem.active = true
  const newCoords = generateRandomCoords(gameItem)
  gameItem.x = newCoords.x
  gameItem.y = newCoords.y

  return {
    type: RETIRED_BOMB,
    gameItem
  }
}

export const removedBombs = () => {
  return {
    type: REMOVED_BOMBS
  }
}

export const killedBomb = gameItem => {
  gameItem.imageUrl = gameItem.explodeUrl
  gameItem.active = false

  return {
    type: KILLED_BOMB,
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
    case GAME_STARTED:
      return {
        ...state,
        gameStarted: true
      }
    case GAME_FINISHED:
      return {
        ...state,
        gameStarted: false
      }
    case GOT_CANVAS_CONTEXT:
      return {
        ...state,
        canvasContext: action.canvas
      }

    case GOT_LEADERBOARD:
      return {
        ...state,
        leaderboard: action.leaderboard
      }
    case GOT_SCORE:
      return {
        ...state,
        finalScore: action.finalScore
      }

    case ADDED_BOMB:
      return {
        ...state,
        riskyGameItems: shuffle([...state.riskyGameItems, action.newBomb])
      }
    case REMOVED_BOMBS:
      return {
        ...state,
        riskyGameItems: [
          ...state.riskyGameItems.filter(item => {
            return item.type !== 'bomb'
          }),
          bomb
        ]
      }
    case RETIRED_BOMB:
      return {
        ...state,
        riskyGameItems: [
          ...state.riskyGameItems.filter(item => {
            return item.id !== action.gameItem.id
          }),
          action.gameItem
        ]
      }
    case KILLED_BOMB: {
      return {
        ...state,
        riskyGameItems: state.riskyGameItems.map(item => {
          if (item.id === action.gameItem.id) {
            return action.gameItem
          } else return item
        })
      }
    }
    default:
      return state
  }
}

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware))
const store = createStore(reducer, middleware)

export default store
