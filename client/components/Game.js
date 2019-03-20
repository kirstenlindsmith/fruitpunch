import React, {Component} from 'react'
import GameItem from './GameItem'
import {connect} from 'react-redux'
import {bodyPointLocations, findPoint, throttler} from './utils'
import {removedGameItem, restartItems} from '../store'
// import throttle from 'lodash.throttle'
// test without bodyPointLocations imported

class Game extends Component {
  constructor(props) {
    super(props)

    this.startGame = this.startGame.bind(this)
    this.restartGame = this.restartGame.bind(this)
  }

  shouldComponentUpdate() {
    //if there are still any active game items...
    return !!this.props.gameItems.length
  }

  componentDidUpdate() {
    this.startGame()
  }

  // THE GAME
  startGame() {
    if (this.props.keypoints.length && this.props.gameItems.length) {
      const rightWristCoords = findPoint('rightWrist', this.props.keypoints)
      const itemCoords = {
        x: this.props.gameItems[0].x,
        y: this.props.gameItems[0].y
      }
      const objectWidth = this.props.gameItems[0].width
      const objectRadius = objectWidth * Math.sqrt(2) / 2
      const objectCenterX =
        Math.floor(Math.cos(Math.PI / 4) * objectRadius) + itemCoords.x
      const objectCenterY =
        Math.floor(Math.sin(Math.PI / 4) * objectRadius) + itemCoords.y
      const distance = Math.sqrt(
        Math.pow(rightWristCoords.x - objectCenterX, 2) +
          Math.pow(rightWristCoords.y - objectCenterY, 2)
      )
      //NOTE: when hand approaches from the bottom right angle, it's slightly less responsive (hand has to travel farther into the object for it to hit)
      if (objectRadius > distance) {
        console.log('WRIST COORDS WHEN IT HIT!!!', rightWristCoords)
        console.log('hit it!!!')
        if (this.props.gameItems.length) {
          //retire the item
          this.props.removeGameItem(this.props.gameItems[0])
        }
      }
    } else this.restartGame()
  }

  restartGame() {
    console.log('game restarted')
    this.props.respawnItems()
  }

  render() {
    let item
    if (this.props.gameItems.length) {
      item = this.props.gameItems[0]
    } else
      item = {
        id: null,
        imageUrl: null,
        x: null,
        y: null
      }
    console.log('gameItems', this.props.gameItems)
    return (
      <div>
        <h1>hit it!</h1>

        <GameItem
          key={item.id}
          imageUrl={item.imageUrl}
          x={item.x}
          y={item.y}
          width={item.width}
        />

        <div>
          <button type="button" onClick={this.restartGame}>
            RESTART
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  keypoints: state.keypoints,
  gameItems: state.activeGameItems
})

const mapDispatchToProps = dispatch => ({
  removeGameItem: item => {
    dispatch(removedGameItem(item))
  },
  respawnItems: () => {
    dispatch(restartItems())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Game)
