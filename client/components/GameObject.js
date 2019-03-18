import React from 'react'

// object coords in store so Game component can use
const GameObject = props => {
  const imageUrl = props.imageUrl || 'https://i.gifer.com/5DYJ.gif'
  const x = props.x || 100
  const y = props.y || 400
  const width = props.width
  const height = props.width

  return (
    <div>
      <img
        src={imageUrl}
        style={{
          position: 'fixed',
          top: {y},
          left: {x},
          width: {width},
          height: {height}
        }}
        className="gameObject"
      />
    </div>
  )
}

export default GameObject
