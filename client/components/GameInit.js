import React, {Component} from 'react'
import {connect} from 'react-redux'
import {findPoint} from './utils'
import {gotProportions} from '../store'

class GameInit extends Component {
  shouldComponentUpdate() {
    return !this.props.initialBody.score
  } /* equivalent to the ternary:
  `return this.props.initialBody.score ? false : true`
  meaning: if the initialBody in the global store has a score (and thus keypoints) property, no need to update. Otherwise, keep updating till it captures an initialBody
  */

  componentDidUpdate() {
    if (this.props.initialBody.score) {
      this.calculateProportions()
    }
  }

  calculateProportions() {
    const initialKeypoints = this.props.initialBody.keypoints

    const leftEyeCoords = findPoint('leftEye', initialKeypoints)
    const leftShoulderCoords = findPoint('leftShoulder', initialKeypoints)
    const leftElbowCoords = findPoint('leftElbow', initialKeypoints)
    const leftWristCoords = findPoint('leftWrist', initialKeypoints)
    const leftHipCoords = findPoint('leftHip', initialKeypoints)
    const leftKneeCoords = findPoint('leftKnee', initialKeypoints)
    const leftAnkleCoords = findPoint('leftAnkle', initialKeypoints)

    const distanceBetween = (p1, p2) => Math.abs(p1 - p2)

    //`D = √ dx^2 + dy2`, or:
    //the distance between two x,y points is the square root of the difference between the two x coords of the points, cubed, plus the difference between the two y coords of the points, cubed. --https://www.mathopenref.com/coorddist.html

    const height =
      //eye to ankle
      Math.sqrt(
        Math.pow(distanceBetween(leftEyeCoords.x, leftAnkleCoords.x), 2) +
          Math.pow(distanceBetween(leftEyeCoords.y, leftAnkleCoords.y), 2)
      )

    const armLength =
      //shoulder to elbow
      Math.sqrt(
        Math.pow(distanceBetween(leftShoulderCoords.x, leftElbowCoords.x), 2) +
          Math.pow(distanceBetween(leftShoulderCoords.y, leftElbowCoords.y), 2)
      ) +
      //+ elbow to wrist
      Math.sqrt(
        Math.pow(distanceBetween(leftElbowCoords.x, leftWristCoords.x), 2) +
          Math.pow(distanceBetween(leftElbowCoords.y, leftWristCoords.y), 2)
      )

    const legLength =
      //hip to knee
      Math.sqrt(
        Math.pow(distanceBetween(leftHipCoords.x, leftKneeCoords.x), 2) +
          Math.pow(distanceBetween(leftHipCoords.y, leftKneeCoords.y), 2)
      ) +
      //+ knee to ankle
      Math.sqrt(
        Math.pow(distanceBetween(leftKneeCoords.x, leftAnkleCoords.x), 2) +
          Math.pow(distanceBetween(leftKneeCoords.y, leftAnkleCoords.y), 2)
      )

    const proportions = {
      height,
      armLength,
      legLength
    }

    //and send them to the global state via dispatch:
    this.props.getProportions(proportions)
  }

  render() {
    return (
      <div id="countdownDiv" className="centered">
        <img id="countdownGif" src="/assets/countdown.gif" />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    initialBody: state.initialBody
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProportions: proportions => {
      dispatch(gotProportions(proportions))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameInit)
