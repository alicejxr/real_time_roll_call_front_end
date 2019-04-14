import React, { Component } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import PropTypes from 'prop-types'
import Select, { Option } from 'rc-select'
import { Calendar } from 'react-date-range'
import zhCN from 'react-date-range/src/locale/zh-CN'
import { format } from 'date-fns'
import Table from 'rc-table'
import Button from '../../../components/Button'

import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import 'rc-table/assets/index.css'
import './index.css'

function formatDateDisplay (date, defaultText) {
  if (!date) return defaultText
  return format(date, 'YYYY-MM-DD')
}

class RollCallInfoPage extends Component {
  state = {
    date: null,
    isSelect: true,
    courseId: 0,
    classId: 0
  }

  onSelectionChange = (_, option) => {
    this.setState({
      courseId: option.key
    })
  }

  showCalendar = () => {
    this.setState({
      isSelect: false
    })
  }

  handleCalendarSelect = date => {
    console.log(date)
    this.setState({
      date,
      isSelect: true
    })
  }

  handleClassChange = e => {
    this.setState({
      classId: e.target.value
    })
  }

  getRollCallTable = () => {
    const { courseId, date, classId } = this.state
    const body = {
      course_id: courseId,
      date,
      class_id: classId
    }
    console.log(body)
  }

  render () {
    const { courses = [] } = this.props
    const { date, isSelect } = this.state
    const columns = [{
      title: '课程', dataIndex: 'course_id', key: 'course_id', width: 100
    }, {
      title: '班级', dataIndex: 'class_id', key: 'class_id', width: 100
    }, {
      title: '学号', dataIndex: 'student_id', key: 'student_id', width: 200
    }, {
      title: '姓名', dataIndex: 'student_name', key: 'student_name', width: 200
    }, {
      title: '是否出勤',
      dataIndex: 'on_call',
      key: 'on_call',
      render: (value, row, index) => {
        return (
          <span>
            {
              value ? '出勤' : '未出勤'
            }
          </span>
        )
      },
      width: 200
    }, {
      title: '时间', dataIndex: 'date', key: 'date', width: 200
    }, {
      title: '出勤照片',
      dataIndex: 'cur_face_url',
      key: 'cur_face_url',
      render: (value, row, index) => {
        return (
          <a href={value}>
            点击查看图片
          </a>
        )
      },
      width: 200
    }]

    const data = [
      { course_id: 1, class_id: 21522, student_id: 2152232, student_name: '贾欣蕊', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: false, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '1' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '2' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '3' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '4' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '5' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '6' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '7' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '8' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '9' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '10' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '11' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '12' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '13' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '14' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '15' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '16' },
      { course_id: 2, class_id: 21522, student_id: 2152233, student_name: '许嵩', date: format(new Date(), 'YYYY-MM-DD HH:MM:SS'), on_call: true, cur_face_url: 'http://182.254.168.171/images/IMG_1216.jpeg', key: '17' }
    ]
    return (<div className='RollCallInfo'>
      <span className='RollCallInfo-title'>
        课堂点名信息
      </span>
      <div className='RollCallInfo-Table-header'>
        <Select
          placeholder='请选择相应课程'
          className='RollCallInfo-select'
          style={{ width: 200 }}
          animation='slide-up'
          showSearch={false}
          onChange={this.onSelectionChange}
        >
          {
            courses.map(item => {
              const { co_id: coId, name } = item
              return (
                <Option key={coId} value={name}>{name}</Option>
              )
            })
          }
        </Select>
        <div className='RollCallInfo-Calendar-wrapper'>
          <input
            className='RollCallInfo-Calendar-input'
            type='text'
            readOnly
            placeholder='请选择日期'
            value={formatDateDisplay(date)}
            onClick={this.showCalendar}
          />
          <Calendar
            className={cx('RollCallInfo-Calendar', { 'RollCallInfo-Calendar--hidden': isSelect })}
            locale={zhCN}
            date={date}
            onChange={this.handleCalendarSelect}
          />
        </div>
        <input
          className='RollCallInfo-Class-input'
          type='number'
          placeholder='请输入班级'
          onChange={this.handleClassChange}
        />
        <Button value='确认' className='RollCallInfo-button' handleClick={this.getRollCallTable} />
      </div>
      <Table columns={columns} data={data} className='RollCallInfo-table' />
    </div>)
  }
}

RollCallInfoPage.propTypes = {
  courses: PropTypes.array
}

const mapStateToProps = state => {
  const { user } = state
  return {
    ...user
  }
}

export default connect(mapStateToProps)(RollCallInfoPage)
