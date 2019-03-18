import React, {Component} from 'react'

// object coords in store so Game component can use
class Object extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: this.props.imageUrl || 'https://i.gifer.com/5DYJ.gif',
      x: 50,
      y: 400
    }
  }

  componentDidMount() {
    this.setState({
      //calcuate user body to render image at coords proportionate to user body size
      x: this.props.x,
      y: this.props.y
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.imageUrl !== this.props.imageUrl) {
      this.setState({
        ...this.state,
        imageUrl: this.props.imageUrl
      })
    }
  }

  render() {
    return (
      <div className="gameObject">
        <img
          src={this.state.imageUrl}
          width="100"
          style={{
            position: 'fixed',
            top: this.state.y,
            left: this.state.x
          }}
          className="gameObject"
        />
      </div>
    )
  }
}

export default Object
