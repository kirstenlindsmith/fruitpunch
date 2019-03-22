/* eslint-disable complexity */
import React, {Component} from 'react'
import * as posenet from '@tensorflow-models/posenet'
import {
  drawKeyPoints,
  drawSkeleton,
  config,
  variablesForCameraRender
} from './utils'
import {connect} from 'react-redux'
import {gotKeypoints, gotInitialBody, gotCanvasContext} from '../store'

class PoseNet extends Component {
  static defaultProps = config

  constructor(props) {
    super(props, PoseNet.defaultProps)
    this.state = {
      loading: true
    }
  }

  getCanvas = elem => {
    this.canvas = elem
  }

  getVideo = elem => {
    this.video = elem
  }

  async componentDidMount() {
    try {
      await this.setupCamera()
    } catch (error) {
      throw new Error(
        'This browser does not support video capture, or this device does not have a camera'
      )
    }

    try {
      this.posenetModel = await posenet.load()
    } catch (error) {
      throw new Error('posenet failed to load')
    } finally {
      setTimeout(() => {
        this.setState({loading: false})
      }, 200)
    }

    this.detectPose()
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      )
    }

    const video = this.video
    video.width = window.innerWidth
    video.height = window.innerHeight

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: window.innerWidth,
          height: window.innerHeight
        }
      })
      video.srcObject = stream
    } catch (error) {
      throw new Error('Failed to access webcam')
    }

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play()
        resolve(video)
      }
    })
  }

  detectPose() {
    const canvas = this.canvas
    const canvasContext = canvas.getContext('2d')
    this.props.getCanvasContext(canvasContext)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.poseDetectionFrame(canvasContext)
  }

  poseDetectionFrame(canvasContext) {
    const {
      algorithm,
      imageScaleFactor,
      flipHorizontal,
      outputStride,
      minPoseConfidence,
      minPartConfidence,
      maxPoseDetections,
      nmsRadius,
      showVideo,
      showPoints,
      showSkeleton,
      skeletonColor,
      skeletonLineWidth
    } = this.props

    const posenetModel = this.posenetModel
    const video = this.video

    const poseDetectionFrameInner = async () => {
      let poses = []

      switch (algorithm) {
        case 'multi-pose': {
          poses = await posenetModel.estimateMultiplePoses(
            video,
            imageScaleFactor,
            flipHorizontal,
            outputStride,
            maxPoseDetections,
            minPartConfidence,
            nmsRadius
          )
          break
        }
        case 'single-pose': {
          const pose = await posenetModel.estimateSinglePose(
            video,
            imageScaleFactor,
            flipHorizontal,
            outputStride
          )
          poses.push(pose)
          break
        }
        default: {
          const pose = await posenetModel.estimateSinglePose(
            video,
            imageScaleFactor,
            flipHorizontal,
            outputStride
          )
          poses.push(pose)
        }
      }

      canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (showVideo) {
        canvasContext.save()
        canvasContext.scale(-1, 1)
        canvasContext.translate(-window.innerWidth, 0)
        canvasContext.drawImage(
          video,
          0,
          0,
          window.innerWidth,
          window.innerHeight
        )
        canvasContext.restore()
      }

      //if no initialbody has been saved on state, and poses[0] is valid (negates a weird error where poses[0] undefined)
      if (!this.props.initialBody.keypoints && poses[0]) {
        if (
          //if the left eye and left hip are visible
          poses[0].keypoints[1].score > minPartConfidence &&
          poses[0].keypoints[11].score > minPartConfidence &&
          !this.props.initialBody.keypoints
        ) {
          console.log('thanks! I can see you now :)')

          //dispatch the first pose into the state
          this.props.getInitialBody(poses[0])
        }
      }

      poses.forEach(({score, keypoints}) => {
        // sending keypoints to the store
        this.props.getKeypoints(keypoints) //Gabe suggested to throttle

        if (score >= minPoseConfidence) {
          if (showPoints) {
            drawKeyPoints(
              keypoints,
              minPartConfidence,
              skeletonColor,
              canvasContext
            )
          }
          if (showSkeleton) {
            drawSkeleton(
              keypoints,
              minPartConfidence,
              skeletonColor,
              skeletonLineWidth,
              canvasContext
            )
          }
        }
      })
      requestAnimationFrame(poseDetectionFrameInner)
    }
    poseDetectionFrameInner()
  }

  render() {
    const {loading, game, gameInit} = variablesForCameraRender(
      this.state.loading
    )

    return (
      <div className="centered">
        <div>{loading}</div>
        <div>
          <video id="videoNoShow" playsInline ref={this.getVideo} />
          {gameInit}
          {game}
          <canvas className="webcam" ref={this.getCanvas} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    initialBody: state.initialBody
  }
}

const mapDispatchToProps = dispatch => ({
  getKeypoints: keypoints => {
    dispatch(gotKeypoints(keypoints))
  },
  getInitialBody: keypoints => {
    dispatch(gotInitialBody(keypoints))
  },
  getCanvasContext: canvas => {
    dispatch(gotCanvasContext(canvas))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PoseNet)
