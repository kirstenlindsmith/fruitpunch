import React, {Component} from 'react'

class Object extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: 'https://i.gifer.com/5DYJ.gif' || props.imageUrl,
      x: 900,
      y: 400
    }
  }

  // componentDidMount(){
  //   this.setState({
  //     ...this.state,
  //     x: this.props.x,
  //     y: this.props.y
  //   })
  // }

  // componentDidUpdate(prevProps){
  //   if (prevProps.x !== this.props.x ||
  //     prevProps.y !== this.props.x ){
  //       this.setState({
  //         x: this.props.x,
  //         y: this.props.y
  //       })
  //     }
  // }

  render() {
    return (
      <div className="gameObject">
        <img
          src={this.state.imageUrl}
          width="100"
          style={{
            position: 'fixed',
            top: this.state.y,
            right: this.state.x
          }}
        />
      </div>
    )
  }
}

export default Object
