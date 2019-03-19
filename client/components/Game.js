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
    if (this.props.keypoints.length) {
      const rightWristCoords = findPoint('rightWrist', this.props.keypoints)
      const itemCoords = {
        x: this.props.gameItems[0].x,
        y: this.props.gameItems[0].y
      }
      console.log('wrist:', rightWristCoords)
      console.log('item:', itemCoords)
      if (
        rightWristCoords.x <= itemCoords.x &&
        rightWristCoords.x >= itemCoords.x - 50 &&
        (rightWristCoords.y <= itemCoords.y &&
          rightWristCoords.y >= itemCoords.y - 50)
      ) {
        console.log('WRIST COORDS WHEN IT HIT!!!', rightWristCoords)
        console.log('hit it!!!')
        if (this.props.gameItems.length) {
          //retire the item
          this.props.removeGameItem(this.props.gameItems[0])
        }
      }
    }
  }

  restartGame() {
    console.log('game restarted')
    this.props.respawnItems()
  }

  render() {
    let activeItems
    if (this.props.gameItems.length) {
      activeItems = this.props.gameItems
    } else activeItems = []

    return (
      <div>
        <h1>hit it!</h1>
        {activeItems.map(item => {
          return (
            <GameItem
              key={item.id}
              imageUrl={item.imageUrl}
              x={item.x} //these are correct
              y={item.y}
            />
          )
        })}
        <div id="start_restart_buttons">
          <button type="button" onClick={this.startGame}>
            START
          </button>{' '}
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
