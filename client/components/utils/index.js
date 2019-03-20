/* eslint-disable complexity */
import * as posenet from '@tensorflow-models/posenet'

const pointRadius = 3

export const config = {
  videoWidth: 900,
  videoHeight: 700,
  flipHorizontal: true,
  algorithm: 'multi-pose',
  showVideo: true,
  showSkeleton: true,
  showPoints: true,
  minPoseConfidence: 0.5,
  minPartConfidence: 0.5,
  maxPoseDetections: 2,
  nmsRadius: 20,
  outputStride: 32,
  imageScaleFactor: 0.5,
  skeletonColor: '#ffadea',
  skeletonLineWidth: 6,
  loadingText: 'Loading...please be patient...'
}

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
//NOTE: e.g., bodyPointLocations[leftEye] = 1

export const gameItems = [
  {
    id: 1,
    type: 'strawberry',
    imageUrl: '/assets/strawberry.gif',
    activeUrl: '/assets/strawberry.gif',
    explodeUrl: '/assets/explodeRED.gif',
    active: true,
    x: 200,
    y: 200,
    width: 150
  },
  {
    id: 2,
    type: 'banana',
    imageUrl: '/assets/banana.gif',
    activeUrl: '/assets/banana.gif',
    explodeUrl: '/assets/explodeYELLOW.gif',
    active: true,
    x: 400,
    y: 400,
    width: 150
  },
  {
    id: 3,
    type: 'blackberry',
    imageUrl: '/assets/blackberry.gif',
    activeUrl: '/assets/blackberry.gif',
    explodeUrl: '/assets/explodePURPLE.gif',
    active: true,
    x: 600,
    y: 300,
    width: 150
  },
  {
    id: 4,
    type: 'kiwi',
    imageUrl: '/assets/kiwi.gif',
    activeUrl: '/assets/kiwi.gif',
    explodeUrl: '/assets/explodeGREEN.gif',
    active: true,
    x: 100,
    y: 500,
    width: 150
  }
]

function toTuple({x, y}) {
  return [x, y]
}

export function drawKeyPoints(
  keypoints,
  minConfidence,
  skeletonColor,
  canvasContext,
  scale = 1
) {
  keypoints.forEach(keypoint => {
    if (keypoint.score >= minConfidence) {
      const {x, y} = keypoint.position
      canvasContext.beginPath()
      canvasContext.arc(x * scale, y * scale, pointRadius, 0, 2 * Math.PI)
      canvasContext.fillStyle = skeletonColor
      canvasContext.fill()
    }
  })
}

function drawSegment(
  [firstX, firstY],
  [nextX, nextY],
  color,
  lineWidth,
  scale,
  canvasContext
) {
  canvasContext.beginPath()
  canvasContext.moveTo(firstX * scale, firstY * scale)
  canvasContext.lineTo(nextX * scale, nextY * scale)
  canvasContext.lineWidth = lineWidth
  canvasContext.strokeStyle = color
  canvasContext.stroke()
}

export function drawSkeleton(
  keypoints,
  minConfidence,
  color,
  lineWidth,
  canvasContext,
  scale = 1
) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  )

  adjacentKeyPoints.forEach(keypoint => {
    drawSegment(
      toTuple(keypoint[0].position),
      toTuple(keypoint[1].position),
      color,
      lineWidth,
      scale,
      canvasContext
    )
  })
}

export function findPoint(bodyPart, keypoints) {
  const bodyPartIndex = bodyPointLocations[bodyPart]
  const bodyPartPosition = keypoints[bodyPartIndex].position

  return {x: bodyPartPosition.x, y: bodyPartPosition.y}
}

//FUNCTION TO PRODUCE VARIABLES FOR THE CAMERA.JS RENDER
import React from 'react'
import Game from '../Game'
import GameInit from '../GameInit'
import store from '../../store'

export const variablesForCameraRender = loadingStatus => {
  let state = store.getState()

  const poseCapture = state.initialBody ? state.initialBody : []

  const loading = loadingStatus ? (
    <img className="loading" src="/assets/loading.gif" />
  ) : null

  const game = loadingStatus ? null : <Game />

  const gameInit = loadingStatus ? null : (
    <GameInit initialPoseCapture={poseCapture} loading={loadingStatus} />
  )

  const getIntoTheFrame =
    !state.proportions.height && !loadingStatus ? (
      <img className="getIntoTheFrame" src="/assets/movePrompt.png" />
    ) : null

  const ready =
    state.proportions.height && !loadingStatus ? (
      <img id="ready" src="/assets/ready.png" />
    ) : null

  return {
    loading,
    game,
    gameInit,
    getIntoTheFrame,
    ready
  }
}
