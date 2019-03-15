//initial state
const initialState = {
  keypoints: [],
  initialBody: []
}

//action types
const GOT_KEYPOINTS = 'GOT_KEYPOINTS'

//action creators
export const gotKeypoints = keypoints => {
  return {
    type: GOT_KEYPOINTS,
    keypoints
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
    default:
      return state
  }
}

export default keyPointsReducer
