import React, {Component} from 'react'

class Object extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: props.imageUrl || 'https://i.gifer.com/5DYJ.gif',
      x: 50,
      y: 400
    } //upper left hand corner is the actual coordinates
  }

  componentDidMount() {
    this.setState({
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
      <div>
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
