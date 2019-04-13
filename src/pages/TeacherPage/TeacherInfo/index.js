import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import './index.css'

class TeacherInfoPage extends Component {
  state = { }

  render () {
    const { role, id, name, courses = [] } = this.props
    return (
      <div className='TeacherInfo'>
        <span className='TeacherInfo-title'>
        教师信息
        </span>
        <div className='TeacherInfo-content'>
          <div className='TeacherInfo-text'>
            <div className='TeacherInfo-item'>
              <span className='TeacherInfo-key'>ID: </span>
              <span className='TeacherInfo-value'>{id}</span>
            </div>
            <div className='TeacherInfo-item'>
              <span className='TeacherInfo-key'>姓名: </span>
              <span className='TeacherInfo-value'>{name}</span>
            </div>
            <div className='TeacherInfo-item'>
              <span className='TeacherInfo-key'>身份: </span>
              <span className='TeacherInfo-value'>{role === 'student' ? '学生' : '教师'}</span>
            </div>
            <div className='TeacherInfo-item'>
              <span className='TeacherInfo-key'>教授课程: </span>
              <div className='TeacherInfo-courses'>
                {
                  courses.map(course => {
                    const { co_id: id, name } = course
                    return (
                      <p className='TeacherInfo-course' key={id}>{name}</p>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>)
  }
}

TeacherInfoPage.propTypes = {
  role: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  courses: PropTypes.array
}

const mapStateToProps = state => {
  const { user } = state
  return {
    ...user
  }
}

export default connect(mapStateToProps)(TeacherInfoPage)
