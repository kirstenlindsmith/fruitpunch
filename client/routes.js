import React, {Component} from 'react'
import {withRouter, Route, Switch} from 'react-router-dom'
import Camera from './components/Camera'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <div>
        {/* <Switch> */}
        <Route path="/" component={Camera} key="Camera" />
        {/* </Switch> */}
      </div>
    )
  }
}

export default withRouter(Routes)
