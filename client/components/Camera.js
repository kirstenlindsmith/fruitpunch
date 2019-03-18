import React, {Component} from 'react'
import * as posenet from '@tensorflow-models/posenet'
import {drawKeyPoints, drawSkeleton, config} from './utils'
import {connect} from 'react-redux'
import {gotKeypoints, recordInitialBody} from '../store'
import VariablesForRender from './utils/varsForCameraRender'

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
      this.net = await posenet.load()
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

    const {videoWidth, videoHeight} = this.props
    const video = this.video
    video.width = window.innerWidth //videoWidth
    video.height = window.innerHeight //videoHeight

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: window.innerWidth, //videoWidth,
        height: window.innerHeight //videoHeight
      }
    })

    video.srcObject = stream

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play()
        resolve(video)
      }
    })
  }

  detectPose() {
    const {videoWidth, videoHeight} = this.props
    const canvas = this.canvas
    const canvasContext = canvas.getContext('2d')

    canvas.width = window.innerWidth //videoWidth
    canvas.height = window.innerHeight //videoHeight

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
      videoWidth,
      videoHeight,
      showVideo,
      showPoints,
      showSkeleton,
      skeletonColor,
      skeletonLineWidth
    } = this.props

    const net = this.net
    const video = this.video

    const poseDetectionFrameInner = async () => {
      let poses = []

      switch (algorithm) {
        case 'multi-pose': {
          poses = await net.estimateMultiplePoses(
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
          const pose = await net.estimateSinglePose(
            video,
            imageScaleFactor,
            flipHorizontal,
            outputStride
          )
          poses.push(pose)
          break
        }
        default: {
          const pose = await net.estimateSinglePose(
            video,
            imageScaleFactor,
            flipHorizontal,
            outputStride
          )
          poses.push(pose)
        }
      }

      //canvasContext.clearRect(0, 0, videoWidth, videoHeight)
      canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (showVideo) {
        canvasContext.save()
        canvasContext.scale(-1, 1)
        // canvasContext.translate(-videoWidth, 0)
        canvasContext.translate(-window.innerWidth, 0)
        //canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight)
        canvasContext.drawImage(
          video,
          0,
          0,
          window.innerWidth,
          window.innerHeight
        )
        canvasContext.restore()
      }

      // console.log('height?', !this.props.proportions.height) //IS EVENTUALLY FALSE!

      //if no initial proportions have been saved on state
      if (!this.props.proportions.height) {
        setTimeout(() => {
          if (
            //if the left eye and left ankle are visible
            poses[0].keypoints[1].score > minPartConfidence &&
            poses[0].keypoints[15].score > minPartConfidence &&
            !this.props.proportions.height //and there still aren't proportions
          ) {
            console.log('thanks! I can see you :)')
            //dispatch the first pose into the state
            this.props.getInitialBody(poses[0])
          } else if (!this.props.proportions.height) {
            //prompt user to move into frame
            console.log('PLEASE MOVE YOUR WHOLE BODY IN THE FRAME')
            // while(this.props.initialPoses === 0){ //<-can't use a while loop or it very quickly overloads chrome
            // console.log('Move your WHOLE BODY into the frame!')
            // setTimeout(()=>{
            //   if ( //if the left eye and left ankle are visible
            //     poses[0].keypoints[1].score > minPartConfidence &&
            //     poses[0].keypoints[15].score > minPartConfidence
            //   ){
            //     this.props.getInitialBody(poses[0])
            //     console.log('Ok NOW we got you!!!')
            //   }
            // }, 5000) //give em 5 more seconds?
            // }
          } else {
            //anything we put inside here will run like 100ish times for some reason
            // console.log('still no proportions...')
          }
        }, 12000) //12 second timer
      } //NOTE: goal is recording the initial pose ONLY when all needed keypoints are in the frame

      poses.forEach(({score, keypoints}) => {
        // sending keypoints to the store
        this.props.getKeypoints(keypoints)

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
    const {
      loading,
      game,
      gameInit,
      getIntoTheFrame,
      ready,
      proportions
    } = VariablesForRender(this.state.loading)

    return (
      <div className="centered">
        <div>{loading}</div>
        <div>
          <video id="videoNoShow" playsInline ref={this.getVideo} />
          {game}
          {ready}
          {gameInit}
          {getIntoTheFrame}
          <canvas className="webcam" ref={this.getCanvas} />
          {proportions}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    keypointsOnState: state.keypoints,
    initialBody: state.initialBody,
    proportions: state.proportions,
    state: state
  }
}

const mapDispatchToProps = dispatch => ({
  getKeypoints: keypoints => {
    dispatch(gotKeypoints(keypoints))
  },
  getInitialBody: keypoints => {
    dispatch(recordInitialBody(keypoints))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PoseNet)
