import React, {Component} from 'react'
import GameItem from './GameItem'
import {connect} from 'react-redux'
import {bodyPointLocations, findPoint} from './utils'
import {killedGameItem, removedGameItem, restartItems} from '../store'
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
        if (this.props.gameItems.length) {
          //explode the item
          this.props.explodeItem(this.props.gameItems[0])
          // console.log(
          //   'game items post-explode, pre-removal:',
          //   this.props.gameItems
          // )
          //retire the item
          // this.props.removeGameItem(this.props.gameItems[0]) //removes too quick, before the gif can play
          setTimeout(() => {
            this.props.removeGameItem(this.props.gameItems[0])
            console.log('one item removed')
          }, 600)
          // console.log('game items AFTER REMOVAL:', this.props.gameItems)
        }
      }
    } else {
      setTimeout(() => {
        if (!this.props.gameItems.length) {
          this.restartGame()
        }
      }, 1000)
    }
  }

  restartGame() {
    console.log('game restarted')
    this.props.respawnItems()
  }

  render() {
    // console.log('ACTIVE GAME ITEMS:', this.props.gameItems)
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

    return (
      <div>
        <GameItem
          key={item.id}
          imageUrl={item.imageUrl}
          x={item.x}
          y={item.y}
          width={item.width}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  keypoints: state.keypoints,
  gameItems: state.activeGameItems
})

const mapDispatchToProps = dispatch => ({
  explodeItem: item => {
    dispatch(killedGameItem(item))
  },
  removeGameItem: item => {
    dispatch(removedGameItem(item))
  },
  respawnItems: () => {
    dispatch(restartItems())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Game)
