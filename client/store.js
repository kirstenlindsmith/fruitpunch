//initial state
const initialState = {
  keypoints: [],
  initialBody: [],
  objCoords: {
    x: 0,
    y: 0
  }
}

//action types
const GOT_KEYPOINTS = 'GOT_KEYPOINTS'
const GOT_OBJCOORDS = 'GOT_OBJCOORDS'

//action creators
export const gotKeypoints = keypoints => {
  return {
    type: GOT_KEYPOINTS,
    keypoints
  }
}

export const gotObjCoords = objCoords => {
  return {
    type: GOT_OBJCOORDS,
    objCoords
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
    case GOT_OBJCOORDS:
      return {
        ...state,
        objCoords: action.objCoords
      }
    default:
      return state
  }
}

export default keyPointsReducer
