//initial state
const initialState = {
  keypoints: [],
  initialBody: [],
  proportions: {}
}

//action types
const GOT_KEYPOINTS = 'GOT_KEYPOINTS'
const GOT_INITIALBODY = 'GOT_INITIALBODY'
const GOT_PROPORTIONS = 'GOT_PROPORTIONS'

//action creators
export const gotKeypoints = keypoints => {
  return {
    type: GOT_KEYPOINTS,
    keypoints
  }
}

export const recordInitialBody = keypoints => {
  return {
    type: GOT_INITIALBODY,
    keypoints
  }
}

export const gotProportions = proportions => {
  return {
    type: GOT_PROPORTIONS,
    proportions
  }
}

//reducer
const keyPointsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_KEYPOINTS:
      return {
        ...state,
        keypoints: action.keypoints
      }
    case GOT_INITIALBODY:
      return {
        ...state,
        initialBody: action.keypoints
      }
    case GOT_PROPORTIONS:
      return {
        ...state,
        proportions: action.proportions
      }
    default:
      return state
  }
}

export default keyPointsReducer
