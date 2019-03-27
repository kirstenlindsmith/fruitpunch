/* eslint-disable max-params */
/* eslint-disable complexity */
/* eslint-disable max-statements */

// created from PoseNet keypoint map to access certain user body parts
// ex. check if user is in frame, create hand location windows/activate remove game items, spawn items in proportion to user body, etc.
export const bodyPointLocations = {
  nose: 0,
  leftEye: 1,
  rightEye: 2,
  leftEar: 3,
  rightEar: 4,
  leftShoulder: 5,
  rightShoulder: 6,
  leftElbow: 7,
  rightElbow: 8,
  leftWrist: 9,
  rightWrist: 10,
  leftHip: 11,
  rightHip: 12,
  leftKnee: 13,
  rightKnee: 14,
  leftAnkle: 15,
  rightAnkle: 16
}
// ease of use => bodyPointLocations[bodyPart] = idxPositionInKeypointsArr

// body part coordinates helper function
export function findPoint(bodyPart, keypoints) {
  const bodyPartIndex = bodyPointLocations[bodyPart]
  const bodyPartPosition = keypoints[bodyPartIndex].position

  return {x: bodyPartPosition.x, y: bodyPartPosition.y}
}

// spawn coordinates for game items
import store from '../../store'
export function generateRandomCoords(gameItem) {
  let state = store.getState()
  const keypoints = state.keypoints

  // find coordinates of user's shoulders
  const rightShoulderCoords = findPoint('rightShoulder', keypoints)
  const leftShoulderCoords = findPoint('leftShoulder', keypoints)

  // set range to entire window
  let xCoordRange = Math.random() * (window.innerWidth - 150)
  const yCoordRange = Math.random() * (window.innerHeight - 150)
  // do not spawn within user's body (based off of shoulder coords)
  const forbiddenXRange =
    leftShoulderCoords.x + 50 - (rightShoulderCoords.x - 50)

  // if x coordinate lands within forbidden range
  let spawnOnRightSide = true
  if (
    xCoordRange > rightShoulderCoords.x - 150 &&
    xCoordRange < leftShoulderCoords.x
  ) {
    if (spawnOnRightSide === true) xCoordRange += forbiddenXRange
    else xCoordRange -= forbiddenXRange
    // alternate sides to spawn
    spawnOnRightSide = !spawnOnRightSide
  }

  gameItem.x = xCoordRange
  gameItem.y = yCoordRange

  return {
    x: gameItem.x,
    y: gameItem.y
  }
}

export function calculateItemLocation(keypoints, gameItem) {
  const itemWidth = gameItem.width
  const rightWristCoords = findPoint('rightWrist', keypoints)
  const leftWristCoords = findPoint('leftWrist', keypoints)
  const rightElbowCoords = findPoint('rightElbow', keypoints)
  const leftElbowCoords = findPoint('leftElbow', keypoints)

  let itemCoords = {
    x: gameItem.x,
    y: gameItem.y
  }

  // item location window
  const itemRadius = itemWidth * Math.sqrt(2) / 2
  const itemCenterX =
    Math.floor(Math.cos(Math.PI / 4) * itemRadius) + itemCoords.x
  const itemCenterY =
    Math.floor(Math.sin(Math.PI / 4) * itemRadius) + itemCoords.y

  const yDiffR = rightWristCoords.y - rightElbowCoords.y
  const xDiffR = rightWristCoords.x - rightElbowCoords.x

  let angleR = Math.atan(Math.abs(yDiffR) / Math.abs(xDiffR))
  if (yDiffR >= 0 && xDiffR <= 0) angleR = angleR + Math.PI / 2
  if (xDiffR <= 0 && yDiffR < 0) angleR = angleR + Math.PI

  let yDistanceR = Math.sin(angleR) * 50
  let xDistanceR = Math.cos(angleR) * 50
  let rightHandCoordY = yDistanceR + rightWristCoords.y
  let rightHandCoordX = xDistanceR + rightWristCoords.x

  let handToItemDistanceR = Math.sqrt(
    Math.pow(rightHandCoordX - itemCenterX, 2) +
      Math.pow(rightHandCoordY - itemCenterY, 2)
  )

  const yDiffL = leftWristCoords.y - leftElbowCoords.y
  const xDiffL = leftWristCoords.x - leftElbowCoords.x

  let angleL = Math.atan(Math.abs(yDiffL) / Math.abs(xDiffL))
  if (yDiffL >= 0 && xDiffL <= 0) angleL = angleL + Math.PI / 2
  if (xDiffL <= 0 && yDiffL < 0) angleL = angleL + Math.PI
  if (xDiffL > 0 && yDiffL < 0) angleL = angleL + 3 * Math.PI / 2

  let yDistanceL = Math.sin(angleL) * 50
  let xDistanceL = Math.cos(angleL) * 50
  let leftHandCoordY = yDistanceL + leftWristCoords.y
  let leftHandCoordX = xDistanceL + leftWristCoords.x

  let handToItemDistanceL = Math.sqrt(
    Math.pow(leftHandCoordX - itemCenterX, 2) +
      Math.pow(leftHandCoordY - itemCenterY, 2)
  )

  return {
    itemRadius,
    handToItemDistanceL,
    handToItemDistanceR
  }
}

// when a user's body point enters item location window range
export function hitSequence(gameItem, sound, explodeFunc, removeFunc) {
  if (gameItem.type !== 'bomb') {
    explodeFunc(gameItem)
    sound.play()
    let toRemove = gameItem
    setTimeout(() => {
      removeFunc(toRemove)
    }, 260)
  }
}

// Game 1 & 2
export function winGame(
  music,
  stopTimerFunc,
  winSound,
  gameItems,
  explodeFunc,
  squish,
  score,
  getFinalScore
) {
  music.pause()
  stopTimerFunc()
  winSound.play()
  for (let i = 0; i < gameItems.length; i++) explodeFunc(gameItems[i])
  squish.play()
  squish.play()
  getFinalScore(score)
}

// Game 3
export function increaseLevel(
  music,
  stopTimerFunc,
  addBomb,
  restartGame,
  score
) {
  music.pause()
  stopTimerFunc()
  addBomb()
  restartGame(score)
}

// shuffle riskeyGameItems so bombs aren't added right after each other on level increase
export function shuffle(array) {
  const newArray = array.slice()
  let currentIndex = newArray.length
  let tempValue
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    tempValue = newArray[currentIndex]
    newArray[currentIndex] = newArray[randomIndex]
    newArray[randomIndex] = tempValue
  }

  return newArray
}
