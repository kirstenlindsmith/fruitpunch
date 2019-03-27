// all functions provided by PoseNet (with minor tweaks)
import * as posenet from '@tensorflow-models/posenet'

export const config = {
  width: window.innerWidth,
  height: window.innerHeight,
  flipHorizontal: true,
  algorithm: 'multi-pose',
  showVideo: true,
  showSkeleton: false,
  showPoints: false,
  minPoseConfidence: 0.5,
  minPartConfidence: 0.5,
  maxPoseDetections: 2,
  nmsRadius: 20,
  outputStride: 32,
  imageScaleFactor: 0.5,
  skeletonColor: '#ffadea',
  skeletonLineWidth: 6
}

function toTuple({x, y}) {
  return [x, y]
}

const pointRadius = 3
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
