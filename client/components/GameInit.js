import React from 'react'
import {connect} from 'react-redux'

const GameInit = props => {
  const getIntoTheFrame =
    !props.initialBody.keypoints && !props.loading ? (
      <img className="getIntoTheFrame" src="/assets/movePrompt.png" />
    ) : null

  return (
    <div>
      {getIntoTheFrame}
      <div id="countdownDiv" className="centered">
        <img id="countdownGif" src="/assets/countdown.gif" />
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    initialBody: state.initialBody
  }
}

export default connect(mapStateToProps)(GameInit)
