import React from 'react'
import {connect} from 'react-redux'

const GameInit = props => {
  const getIntoTheFrame =
    !props.initialBody.keypoints && !props.loading ? (
      <img className="getIntoTheFrame" src="/assets/movePrompt.gif" />
    ) : null

  const ready =
    props.initialBody.keypoints && !props.loading ? (
      <img id="ready" src="/assets/ready.gif" />
    ) : null

  return (
    <div>
      {getIntoTheFrame}
      {ready}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    initialBody: state.initialBody
  }
}

export default connect(mapStateToProps)(GameInit)
