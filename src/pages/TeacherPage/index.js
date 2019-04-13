import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import SideBar from '../../components/SideBar'
import Teacher from '../../svg/teacher.svg'
import RollCallInfo from '../../svg/rollcall.svg'
import Face from '../../svg/face.svg'
import TeacherInfoPage from './TeacherInfo'
import RollCallInfoPage from './RollCallInfo'
import RollCallPage from './RollCall'

import './index.css'

class TeacherPage extends Component {
  componentDidMount () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { role } = user
    if (role !== 'teacher') {
      this.props.history.push(`/${role === 'student' ? role : 'login'}`)
    }
  }

  render () {
    return (
      <div className='Teacher'>
        <SideBar
          config={[
            { key: '/teacher', value: '教师信息', icon: Teacher },
            { key: '/teacher/rollcall', value: '课堂点名', icon: Face },
            { key: '/teacher/rollcall-info', value: '课堂点名信息', icon: RollCallInfo }
          ]}
        />
        <Switch>
          <Route path='/teacher' exact component={TeacherInfoPage} />
          <Route path='/teacher/rollcall' component={RollCallPage} />
          <Route path='/teacher/rollcall-info' component={RollCallInfoPage} />
        </Switch>
      </div>
    )
  }
}

TeacherPage.propTypes = {
  history: PropTypes.object
}

const mapStateToProps = state => {
  const { students } = state
  return { students }
}

export default withRouter(connect(mapStateToProps)(TeacherPage))
