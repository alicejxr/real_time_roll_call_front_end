import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import SideBar from '../../components/SideBar'
import Recognize from './Recognize'
import Upload from './Upload'

import './index.css'

class RollCallPage extends Component {
  render () {
    return (
      <div className='RollCallPage'>
        <SideBar config={[
          { key: '/roll-call/recognize', value: '人脸自动录入' },
          { key: '/roll-call/upload', value: '人脸手动录入' }
        ]} />
        <Route path='/roll-call/recognize' component={Recognize} />
        <Route path='/roll-call/upload' component={Upload} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { students } = state
  return { students }
}

export default connect(mapStateToProps)(RollCallPage)
