import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import FaceAuto from './FaceAuto'
import FaceInfo from './FaceInfo'
import SideBar from '../../components/SideBar'
import Face from '../../svg/face.svg'
import Upload from '../../svg/upload.svg'

import './index.css'

class StudentPage extends Component {
  render () {
    return (
      <div className='Student' onClick={this.handleClick}>
        <SideBar
          config={[
            { key: '/student', value: '学生人脸信息', icon: Upload },
            { key: '/student/recognize', value: '人脸自动录入', icon: Face }
          ]}
        />
        <Switch>
          <Route path='/student' exact component={FaceInfo} />
          <Route path='/student/recognize' component={FaceAuto} />
        </Switch>
      </div>
    )
  }
}

StudentPage.propTypes = {}

const mapStateToProps = state => {
  const { students } = state
  return { students }
}

export default connect(mapStateToProps)(StudentPage)
