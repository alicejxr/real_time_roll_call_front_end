import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as faceapi from 'face-api.js'
import { getFaceDetectorOptions, isFaceDetectionModelLoaded, changeFaceDetector, TINY_FACE_DETECTOR } from './js/faceDetectionControls'
import { drawDetections } from './js/drawing'
import { uploadFacePicture } from '../../../redux/actions'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'

import './index.css'

class FaceAuto extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shouldShowModal: false
    }
    this.video = React.createRef()
    this.canvas = React.createRef()
    this.picture = React.createRef()
  }

  componentDidMount () {
    this.loadModel()
  }

  componentWillUnmount () {
    if (this.stream) {
      const video = this.video.current
      video.pause()
      video.removeAttribute('src')
      this.stream.getTracks()[0].stop()
    }

    this.timer && clearTimeout(this.timer)
  }

  loadModel = async () => {
    try {
      // load face detection model
      await changeFaceDetector(TINY_FACE_DETECTOR)
      if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
        // 调用用户媒体设备，访问摄像头
        this.getUserMedia({
          video: { width: 480, height: 320 }
        }, this.success, this.error)
      } else {
        window.alert('你的浏览器不支持访问用户媒体设备')
      }
    } catch (e) {
      console.log(e)
    }
  }

  getUserMedia = (constrains, success, error) => {
    if (navigator.mediaDevices.getUserMedia) {
      // 最新标准API
      navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error)
    } else if (navigator.webkitGetUserMedia) {
      // webkit内核浏览器
      navigator.webkitGetUserMedia(constrains).then(success).catch(error)
    } else if (navigator.mozGetUserMedia) {
      // Firefox浏览器
      navigator.mozGetUserMedia(constrains).then(success).catch(error)
    } else if (navigator.getUserMedia) {
      // 旧版API
      navigator.getUserMedia(constrains).then(success).catch(error)
    }
  }

   success = async (stream) => {
     const video = this.video.current

     this.stream = stream

     // 兼容webkit内核浏览器
     var CompatibleURL = window.URL || window.webkitURL
     // 将视频流设置为video元素的源
     try {
       video.srcObject = stream
     } catch (error) {
       video.src = CompatibleURL.createObjectURL(stream)
     }
   }

  error = (error) => {
    console.log('访问用户媒体设备失败：', error.name, error.message)
  }

  onPlay = async () => {
    const video = this.video.current
    const canvas = this.canvas.current
    const context = canvas.getContext('2d')
    context.fillStyle = 'rgba(255, 255, 255, 0)'

    if (!isFaceDetectionModelLoaded()) {
      return setTimeout(() => this.onPlay())
    }

    const options = getFaceDetectorOptions()
    const result = await faceapi.detectSingleFace(video, options)

    if (result) {
      drawDetections(video, canvas, [result])
    }
    this.timer = setTimeout(() => this.onPlay())
  }

  takePicture = () => {
    this.showModal()
    const video = this.video.current
    const picture = this.picture.current
    const context = picture.getContext('2d')

    context.drawImage(video, 0, 0, 360, 240)
  }

  uploadPicture = () => {
    const picture = this.picture.current
    const dataurl = picture.toDataURL('image/jpeg', 1.0)
    this.props.dispatch(uploadFacePicture(dataurl)).then(res => {
      if (res === 200) {
        this.closeModal()
      }
    })
  }

  closeModal = () => {
    this.setState({
      shouldShowModal: false
    })
  }

  showModal = () => {
    this.setState({
      shouldShowModal: true
    })
  }

  render () {
    const { shouldShowModal } = this.state
    return (<div className='FaceAuto'>
      <span className='FaceAuto-title'>
        人脸自动录入
      </span>
      <span className='FaceAuto-subtitle'>
        请确保录入的人脸在下方录入区被识别以避免上传失败
      </span>
      <div className='FaceAuto-content'>
        <video className='FaceAuto-video' ref={this.video} onPlay={this.onPlay} autoPlay muted />
        <canvas className='FaceAuto-canvas' ref={this.canvas} width='480' height='320' />
      </div>
      <Button className='FaceAuto-button' handleClick={this.showModal} value='拍照' />
      {
        shouldShowModal &&
        <Modal closeModal={this.closeModal} componentDidMount={this.takePicture} className='FaceAuto-modal'>
          <div className='FaceAuto-ModalTitle'>
            确认使用这张图片吗?
          </div>
          <canvas className='FaceAuto-picture' ref={this.picture} width='360' height='240' />
          <Button className='FaceAuto-modalButton' value='确认' handleClick={this.uploadPicture} />
          <Button type='cancel' className='FaceAuto-modalButton' handleClick={this.closeModal} value='取消' />
        </Modal>
      }
    </div>)
  }
}

FaceAuto.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(FaceAuto)
