import { connect } from 'react-redux'
import { format } from 'date-fns'
import * as faceapi from 'face-api.js'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Select, { Option } from 'rc-select'

import 'rc-select/assets/index.css'

import { drawDetections } from './js/drawing'
import { getFaceDetectorOptions, isFaceDetectionModelLoaded, changeFaceDetector, TINY_FACE_DETECTOR } from './js/faceDetectionControls'
import { recognizeFace } from '../../../redux/actions'
import { times } from '../constants'
import Button from '../../../components/Button'

import './index.css'

class RollCall extends Component {
  constructor (props) {
    super(props)
    this.state = {
      studentId: '',
      courseId: null,
      timeId: null,
      date: null
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
    const video = this.video.current
    const picture = this.picture.current
    const context = picture.getContext('2d')

    context.drawImage(video, 0, 0, 360, 240)
  }

  onSelectChange = (_, option) => {
    this.setState({
      courseId: option.key
    })
  }

  onTimeChange = (_, option) => {
    this.setState({
      timeId: option.key
    })
  }

  handleCalendarSelect = date => {
    this.setState({
      date: date
    })
  }

  handleIdChange = e => {
    this.setState({
      studentId: e.target.value
    })
  }

  recognizeFace = () => {
    this.takePicture()
    const picture = this.picture.current
    const dataurl = picture.toDataURL('image/jpeg', 1.0)
    const { studentId, courseId, date, timeId } = this.state
    const body = {
      studentId,
      courseId,
      timeId,
      date: format(date, 'yyyy-MM-dd')
    }
    this.props.dispatch(recognizeFace(dataurl, body)).then(code => {
      if (code === 200) {
        this.setState({
          studentId: ''
        })
      }
    })
  }

  render () {
    const { courses = [] } = this.props
    const { studentId, courseId, date, timeId } = this.state
    return (<div className='RollCall'>
      <span className='RollCall-title'>
        人脸自动录入
      </span>
      <span className='RollCall-subtitle'>
        请确保录入的人脸在下方录入区被识别以避免上传失败
      </span>
      <div className='RollCall-selects'>
        <Select
          placeholder='请选择相应课程'
          className='RollCall-select'
          style={{ width: 300 }}
          animation='slide-up'
          showSearch={false}
          onChange={this.onSelectChange}
        >
          {
            courses.map(item => {
              const { course_id: coId, name } = item
              return (
                <Option key={coId} value={name}>{name}</Option>
              )
            })
          }
        </Select>
        <Select
          placeholder='请选择课时'
          className='RollCall-select'
          style={{ width: 200 }}
          animation='slide-up'
          showSearch={false}
          onChange={this.onTimeChange}
        >
          {
            times.map(time => {
              const { key, value } = time
              return (
                <Option key={key} value={value}>{value}</Option>
              )
            })
          }
        </Select>
        <DatePicker
          selected={date}
          placeholderText='请选择日期'
          onChange={this.handleCalendarSelect}
        />
      </div>
      <div className='RollCall-content'>
        <video className='RollCall-video' ref={this.video} onPlay={this.onPlay} autoPlay muted />
        <canvas className='RollCall-canvas' ref={this.canvas} width='480' height='320' />
      </div>
      <label className='RollCall-form'>
        <span className='RollCall-formName'>学号:</span>
        <input className='RollCall-formInput' placeholder='请输入学号' type='text' value={studentId} onChange={this.handleIdChange} />
        <canvas className='RollCall-picture' ref={this.picture} width='360' height='240' />
      </label>
      <Button className='RollCall-button' handleClick={this.recognizeFace} value='拍照' disabled={!studentId || !courseId || !date || !timeId} />
    </div>)
  }
}

RollCall.propTypes = {
  courses: PropTypes.array,
  dispatch: PropTypes.func
}

const mapStateToState = state => {
  const { user } = state
  return {
    ...user
  }
}

export default connect(mapStateToState)(RollCall)
