import React, {Component} from 'react'
import * as posenet from '@tensorflow-models/posenet'
import {
  drawKeyPoints,
  drawSkeleton,
  findPoint,
  bodyPointLocations
} from './utils'
import Object from './Object'
import {connect} from 'react-redux'
import {gotKeypoints} from '../store'

class PoseNet extends Component {
  static defaultProps = {
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
    loadingText: 'Loading...please be patient...',
    ObjectX: 300,
    ObjectY: 400
  }

  constructor(props) {
    super(props, PoseNet.defaultProps)
    this.state = {
      loading: true,
      objectImage: 'https://i.gifer.com/5DYJ.gif'
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
      //NOTE: error thrown doesn't account for if posenet.load() fails!
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
    video.width = videoWidth
    video.height = videoHeight

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: videoWidth,
        height: videoHeight
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

    canvas.width = videoWidth
    canvas.height = videoHeight

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

      canvasContext.clearRect(0, 0, videoWidth, videoHeight)

      if (showVideo) {
        canvasContext.save()
        canvasContext.scale(-1, 1)
        canvasContext.translate(-videoWidth, 0)
        canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight)
        canvasContext.restore()
      }

      poses.forEach(({score, keypoints}) => {
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
          // const noseCords = findPoint('nose', keypoints)
          // const objectCords = {x: this.props.ObjectX, y: this.props.ObjectY}

          // if (
          //   noseCords.x <= objectCords.x &&
          //   noseCords.x >= objectCords.x - 50 &&
          //   (noseCords.y <= objectCords.y && noseCords.y >= objectCords.y - 50)
          // ) {
          //   this.setState({
          //     ...this.state,
          //     objectImage: 'https://i.imgur.com/xhRjyzt.png'
          //   })
          // }

          const handCords = findPoint('rightWrist', keypoints)
          const objectCords = {x: this.props.ObjectX, y: this.props.ObjectY}

          if (
            handCords.x <= objectCords.x &&
            handCords.x >= objectCords.x - 50 &&
            (handCords.y <= objectCords.y && handCords.y >= objectCords.y - 50)
          ) {
            this.setState({
              ...this.state,
              objectImage: 'https://i.imgur.com/xhRjyzt.png'
            })
          }
        }
      })
      requestAnimationFrame(poseDetectionFrameInner)
    }
    poseDetectionFrameInner()
  }

  render() {
    const loading = this.state.loading ? (
      <img className="loading" src="/assets/loading.gif" />
    ) : (
      <p className="noShow" />
    )

    // const video = this.state.loading ? <div/> : <video id="videoNoShow" playsInline ref={this.getVideo} />
    const object = this.state.loading ? (
      <div />
    ) : (
      <Object
        x={this.props.ObjectX}
        y={this.props.ObjectY}
        imageUrl={this.state.objectImage}
      />
    )
    // const canvas = this.state.loading? <div/> : <canvas className="webcam" ref={this.getCanvas} />

    return (
      <div className="centered">
        <div>{loading}</div>
        <div>
          <video id="videoNoShow" playsInline ref={this.getVideo} />
          {object}
          <canvas className="webcam" ref={this.getCanvas} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    keypointsOnState: state.keypoints
  }
}

const mapDispatchToProps = dispatch => ({
  getKeypoints: keypoints => {
    dispatch(gotKeypoints(keypoints))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PoseNet)
