import React, {Component} from 'react'
import Object from './Object'
import {connect} from 'react-redux'
import {bodyPointLocations, findPoint} from './utils'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: this.props.width,
      height: this.props.height,
      keypoints: this.props.keypoints,
      imageUrl: 'https://i.gifer.com/5DYJ.gif',
      objCoords: {
        x: 300,
        y: 400
    }
  }

  // THE GAME
  startGame = () => {
    const noseCords = findPoint('nose', this.state.keypoints)
    const objectCords = this.state.objCoords

    if (
      noseCords.x <= objectCords.x &&
      noseCords.x >= objectCords.x - 50 &&
      (noseCords.y <= objectCords.y && noseCords.y >= objectCords.y - 50)
    ) {
      this.setState({
        ...this.state,
        imageUrl: 'https://i.imgur.com/xhRjyzt.png'
      })
    }
  }

  render() {
    return (
      <div>
        <h1>hit the object!</h1>
        <Object imageUrl={this.state.imageUrl} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  objCoords: state.objCoords
})

export default connect(mapStateToProps)(Game)
