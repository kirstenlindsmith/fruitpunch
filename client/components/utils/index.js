/* eslint-disable complexity */
import * as posenet from '@tensorflow-models/posenet'

const pointRadius = 3

export const config = {
  videoWidth: 900,
  videoHeight: 700,
  flipHorizontal: true,
  algorithm: 'single-pose',
  showVideo: true,
  showSkeleton: true,
  showPoints: true,
  minPoseConfidence: 0.1,
  minPartConfidence: 0.5,
  maxPoseDetections: 2,
  nmsRadius: 20,
  outputStride: 16,
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

//bodyPointLocations[leftEye] = 1

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

  adjacentKeyPoints.forEach(keypoints => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
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

  const bodyPartXCord = Math.floor(bodyPartPosition.x)
  const bodyPartYCord = Math.floor(bodyPartPosition.y)
  return {x: bodyPartXCord, y: bodyPartYCord}
}

//FUNCTION TO PRODUCE VARIABLES FOR THE CAMERA.JS RENDER
import React from 'react'
import Game from '../Game'
import GameInit from '../GameInit'
import store from '../store'

export const variablesForCameraRender = loadingStatus => {
  let state = store.getState()

  const poseCapture = state.initialBody ? state.initialBody : []

  const loading = loadingStatus ? (
    <img className="loading" src="/assets/loading.gif" />
  ) : (
    <p className="noShow" />
  )

  const game = loadingStatus ? <div /> : <Game />

  const gameInit = loadingStatus ? (
    <div />
  ) : (
    <GameInit initialPoseCapture={poseCapture} loading={loadingStatus} />
  )

  const getIntoTheFrame =
    !state.proportions.height && !loadingStatus ? (
      <img className="getIntoTheFrame" src="/assets/movePrompt.png" />
    ) : (
      <div className="getIntoTheFrame" />
    )

  const ready =
    state.proportions.height && !loadingStatus ? (
      <img id="ready" src="/assets/ready.png" />
    ) : (
      <div />
    )

  const proportions = state.proportions.height ? (
    <h1 id="bodyMeasurements">
      height: {state.proportions.height} <br />
      arm length: {state.proportions.armLength} <br />
      leg length: {state.proportions.legLength}
    </h1>
  ) : (
    <div />
  )

  return {
    loading,
    game,
    gameInit,
    getIntoTheFrame,
    ready,
    proportions
  }
}
