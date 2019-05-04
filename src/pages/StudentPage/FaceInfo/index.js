import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { modifyPassword, showMessage } from '../../../redux/actions'
import Mask from '../../../components/Mask'
import Camera from '../../../svg/camera.svg'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'

import './index.css'

class FaceInfo extends Component {
  state={
    shouldShowModal: false,
    oldPassword: '',
    newPassword: ''
  }

  handleMaskClick = () => {
    this.props.history.push('/student/recognize')
    window.location.reload()
  }

  handleNewPasswordChange = e => {
    this.setState({
      newPassword: e.target.value
    })
  }

  handleOldPasswordChange = e => {
    this.setState({
      oldPassword: e.target.value
    })
  }

  showModal = () => {
    this.setState({
      shouldShowModal: true
    })
  }

  closeModal = () => {
    this.setState({
      shouldShowModal: false
    })
  }

  modifyPassword = () => {
    const { newPassword, oldPassword } = this.state
    const { id } = this.props
    const body = {
      new_password: newPassword,
      old_password: oldPassword,
      id
    }
    this.props.dispatch(modifyPassword(body)).then(code => {
      if (code === 200) {
        this.closeModal()
        this.props.dispatch(showMessage({ status: 'success', message: '需要重新登录！' }))
        this.timer = setTimeout(() => {
          window.localStorage.removeItem('user')
          window.localStorage.setItem('isLogin', false)
          window.location.reload()
          this.props.history.push('/login')
        }, 2000)
      }
    })
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  render () {
    const { role, class_id: classId, id, name, face_url: faceUrl } = this.props
    const { shouldShowModal, oldPassword, newPassword } = this.state
    return (<div className='FaceInfo'>
      {
        shouldShowModal && <Modal closeModal={this.closeModal} className='StudentInfo-modal'>
          <div className='StudentInfo-form'>
            <label className='StudentInfo-form-item'>
              <span className='StudentInfo-form-item-name'>旧密码:</span>
              <input className='StudentInfo-form-item-input' type='password' value={oldPassword} onChange={this.handleOldPasswordChange} />
            </label>
            <label className='StudentInfo-form-item'>
              <span className='StudentInfo-form-item-name'>新密码:</span>
              <input className='StudentInfo-form-item-input' type='password' value={newPassword} onChange={this.handleNewPasswordChange} />
            </label>
            <Button className='StudentInfo-form-button' disabled={!newPassword || !oldPassword} handleClick={this.modifyPassword} value='修改' />
          </div>
        </Modal>
      }
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
          <Button value='点击修改密码' className='FaceInfo-eidt' handleClick={this.showModal} />
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
  history: PropTypes.object,
  dispatch: PropTypes.func
}

const mapStateToProps = (state) => {
  const { user } = state
  return {
    ...user
  }
}

export default withRouter(connect(mapStateToProps)(FaceInfo))
