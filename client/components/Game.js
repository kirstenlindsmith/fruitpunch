import React, {Component} from 'react'
import GameItem from './GameItem'
import {connect} from 'react-redux'
import {bodyPointLocations, findPoint} from './utils'
import {
  killedGameItem,
  removedGameItem,
  restartItems,
  killItemThunk
} from '../store'
// import throttle from 'lodash.throttle'
// test without bodyPointLocations imported

class Game extends Component {
  constructor(props) {
    super(props)

    this.startGame = this.startGame.bind(this)
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
    if (this.props.keypoints.length) {
      for (let i = 0; i < 2; i++) {
        const rightWristCoords = findPoint('rightWrist', this.props.keypoints)
        const itemCoords = {
          x: this.props.gameItems[i].x,
          y: this.props.gameItems[i].y
        }
        const itemWidth = this.props.gameItems[i].width
        const itemRadius = itemWidth * Math.sqrt(2) / 2
        const itemCenterX =
          Math.floor(Math.cos(Math.PI / 4) * itemRadius) + itemCoords.x
        const itemCenterY =
          Math.floor(Math.sin(Math.PI / 4) * itemRadius) + itemCoords.y
        const distanceR = Math.sqrt(
          Math.pow(rightWristCoords.x - itemCenterX, 2) +
            Math.pow(rightWristCoords.y - itemCenterY, 2)
        )

        const leftWristCoords = findPoint('leftWrist', this.props.keypoints)
        const distanceL = Math.sqrt(
          Math.pow(leftWristCoords.x - itemCenterX, 2) +
            Math.pow(leftWristCoords.y - itemCenterY, 2)
        )

        if (itemRadius > distanceR || itemRadius > distanceL) {
          if (this.props.gameItems[i].active) {
            //explode the item
            this.props.explodeItem(this.props.gameItems[i])
            let toRemove = this.props.gameItems[i]
            setTimeout(() => {
              //retire the item
              this.props.removeGameItem(toRemove)
            }, 260)
          }
        }
      }
    }
  }

  render() {
    const item1 = this.props.gameItems[0]
    const item2 = this.props.gameItems[1]

    return (
      <div>
        <GameItem
          key={item1.id}
          imageUrl={item1.imageUrl}
          x={item1.x}
          y={item1.y}
          width={item1.width}
        />

        <GameItem
          key={item2.id}
          imageUrl={item2.imageUrl}
          x={item2.x}
          y={item2.y}
          width={item2.width}
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
  },
  killThunk: item => {
    dispatch(killItemThunk(item))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Game)
