import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Mask from '../../../components/Mask'
import Camera from '../../../svg/camera.svg'

import './index.css'

class FaceInfo extends Component {
  handleMaskClick = () => {
    this.props.history.push('/student/recognize')
    window.location.reload()
  }

  render () {
    const { role, class_id: classId, id, name, face_url: faceUrl } = this.props
    return (<div className='FaceInfo'>
      <span className='FaceInfo-title'>
        个人信息
      </span>
      <div className='FaceInfo-content'>
        <div className='FaceInfo-img'>
          <img src={faceUrl + '?' + Math.random() * 100} alt='face-img' width='300' height='400' />
          <Mask className='FaceInfo-mask' handleMaskClick={this.handleMaskClick}>
            <div className='FaceInfo-hoverTip'>
              <Camera />
              <div className='Face-tip'>
                重新录入照片
              </div>
            </div>
          </Mask>
        </div>
        <div className='FaceInfo-text'>
          <div className='Faceinfo-item'>
            <span className='FaceInfo-key'>身份: </span>
            <span className='FaceInfo-value'>{role === 'student' ? '学生' : '教师'}</span>
          </div>
          <div className='Faceinfo-item'>
            <span className='FaceInfo-key'>班级: </span>
            <span className='FaceInfo-value'>{classId}</span>
          </div>
          <div className='Faceinfo-item'>
            <span className='FaceInfo-key'>学号: </span>
            <span className='FaceInfo-value'>{id}</span>
          </div>
          <div className='Faceinfo-item'>
            <span className='FaceInfo-key'>姓名: </span>
            <span className='FaceInfo-value'>{name}</span>
          </div>
        </div>
      </div>
    </div>)
  }
}

FaceInfo.propTypes = {
  face_url: PropTypes.string,
  role: PropTypes.string,
  class_id: PropTypes.number,
  id: PropTypes.string,
  name: PropTypes.string,
  history: PropTypes.object
}

const mapStateToProps = (state) => {
  const { user } = state
  return {
    ...user
  }
}

export default withRouter(connect(mapStateToProps)(FaceInfo))
