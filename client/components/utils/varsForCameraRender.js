import React from 'react'
import Game from '../Game'
import GameInit from '../GameInit'
import {connect} from 'react-redux'

const VariablesForRender = loading => {
  const poseCapture = this.props.initialBody ? this.props.initialBody : []

  const loading = props.loading ? (
    <img className="loading" src="/assets/loading.gif" />
  ) : (
    <p className="noShow" />
  )

  const game = props.loading ? <div /> : <Game />

  const gameInit = props.loading ? (
    <div />
  ) : (
    <GameInit initialPoseCapture={poseCapture} loading={props.loading} />
  )

  const getIntoTheFrame =
    !this.props.proportions.height && !props.loading ? (
      <img className="getIntoTheFrame" src="/assets/movePrompt.png" />
    ) : (
      <div className="getIntoTheFrame" />
    )

  const ready =
    this.props.proportions.height && !props.loading ? (
      <img id="ready" src="/assets/ready.png" />
    ) : (
      <div />
    )

  const proportions = this.props.proportions.height ? (
    <h1 id="bodyMeasurements">
      height: {this.props.proportions.height} <br />
      arm length: {this.props.proportions.armLength} <br />
      leg length: {this.props.proportions.legLength}
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

const mapStateToProps = state => {
  return {
    keypoints: state.keypoints,
    initialBody: state.initialBody,
    proportions: state.proportions
  }
}

export default connect(mapStateToProps)(VariablesForRender)
