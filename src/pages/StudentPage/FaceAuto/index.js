import React, { Component } from 'react'
import * as faceapi from 'face-api.js'
import { getFaceDetectorOptions, isFaceDetectionModelLoaded, changeFaceDetector, TINY_FACE_DETECTOR } from './js/faceDetectionControls'
import { drawDetections } from './js/drawing'
import Button from '../../../components/Button'

import './index.css'

class FaceAuto extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isTakePicture: false
    }
    this.video = React.createRef()
    this.canvas = React.createRef()
    this.canvasPicture = React.createRef()
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
    const canvas = this.canvas.current
    const context = canvas.getContext('2d')
    const video = this.video.current

    // 绘制画面
    context.drawImage(video, 0, 0, 480, 320)
  }

  retryTakePicture = () => {
    const canvas = this.canvas.current
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  uploadPicture = () => {
    const canvas = this.canvasPicture.current
    const context = canvas.getContext('2d')
    const video = this.video.current

    // 绘制画面
    context.drawImage(video, 0, 0, 480, 320)
  }

  render () {
    return (<div className='FaceAuto'>
      <div className='FaceAuto-content'>
        <video className='FaceAuto-video' ref={this.video} onPlay={this.onPlay} autoPlay muted />
        <canvas className='FaceAuto-canvas' ref={this.canvas} width='480' height='320' />
      </div>
      <Button className='FaceAuto-button' handleClick={this.takePicture} value='拍照' />
    </div>)
  }
}

export default FaceAuto
