import React, {Component} from 'react'
import GameObject from './GameObject'
import {connect} from 'react-redux'
import {bodyPointLocations, findPoint} from './utils'
// test without bodyPointLocations imported

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameObjects: [
        {
          imageUrl: 'https://i.gifer.com/5DYJ.gif',
          x: 300,
          y: 400
        }
      ]
    }
  }

  // THE GAME
  startGame = () => {
    const rightWristCoords = findPoint('rightWrist', this.props.keypoints)
    const objectCoords = {
      x: this.state.gameObjects[0].x,
      y: this.state.gameObjects[0].y
    }

    if (
      rightWristCoords.x <= objectCoords.x &&
      rightWristCoords.x >= objectCoords.x - 50 &&
      (rightWristCoords.y <= objectCoords.y &&
        rightWristCoords.y >= objectCoords.y - 50)
    ) {
      this.setState({
        ...this.state,
        gameObjects: [
          {
            ...gameObjects[0],
            // invisible image
            imageUrl: 'https://i.imgur.com/xhRjyzt.png'
          }
        ]
      })
    }
  }

  render() {
    return (
      <div>
        <h1>hit the object!</h1>
        {this.state.gameObjects.map(gameObj => (
          <GameObject imageUrl={gameObj.imageUrl} x={gameObj.x} y={gameObj.y} />
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  keypoints: state.keypoints
})

export default connect(mapStateToProps)(Game)
// export default Game
