import React from 'react'

const GameItem = props => {
  const imageUrl = props.imageUrl
  const x = props.x
  const y = props.y
  const width = props.width
  const height = props.width

  const styling = {
    position: 'fixed',
    top: y,
    left: x,
    width: width,
    height: height
  }

  return (
    <div>
      <img src={imageUrl} style={styling} className="gameItem" />
    </div>
  )
}

export default GameItem
