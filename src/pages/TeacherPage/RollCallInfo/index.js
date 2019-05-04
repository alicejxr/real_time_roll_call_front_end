/* eslint-disable camelcase */
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Select, { Option } from 'rc-select'
import Table from 'rc-table'
import { stringify, parseUrl } from 'query-string'

import { getRecords } from '../../../redux/actions'
import { times, timesMap } from '../constants'
import Modal from '../../../components/Modal'
import Button from '../../../components/Button'

import './index.css'

class RollCallInfoPage extends Component {
  state = {
    date: undefined,
    timeId: undefined,
    courseId: undefined,
    classId: '',
    shouldShowModal: false,
    modalUrl: undefined
  }

  componentDidMount () {
    const {
      query: {
        teacher_id,
        course_id,
        date,
        class_id,
        time_id
      }
    } = parseUrl(window.location.href)
    if (window.location.search) {
      const params = {
        teacher_id: Number(teacher_id),
        course_id: Number(course_id),
        date: format(new Date(date), 'yyyy-MM-dd'),
        class_id: Number(class_id),
        time_id: Number(time_id)
      }
      this.setState({
        date: new Date(date),
        timeId: time_id,
        courseId: course_id,
        classId: class_id
      })
      this.props.dispatch(getRecords(params))
    }
  }

  onSelectionChange = (_, option) => {
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
      date
    })
  }

  handleClassChange = e => {
    this.setState({
      classId: e.target.value
    })
  }

  getRollCallTable = () => {
    const { courseId, date, classId, timeId } = this.state
    const { id, history, dispatch } = this.props
    const params = {
      teacher_id: Number(id),
      course_id: Number(courseId),
      date: format(date, 'yyyy-MM-dd'),
      class_id: Number(classId),
      time_id: Number(timeId)
    }
    history.push(`/teacher/rollcall-info?${stringify({ ...params, date })}`)
    dispatch(getRecords(params))
  }

  closeModal = () => {
    this.setState({
      shouldShowModal: false
    })
  }

  showModal = value => {
    this.setState({
      modalUrl: value,
      shouldShowModal: true
    })
  }

  render () {
    const { courses = [], records = [], total = 0, realCount = 0, uncallStudents } = this.props
    const { date, classId, timeId, courseId, shouldShowModal, modalUrl } = this.state
    const columns = [{
      title: '课程',
      dataIndex: 'course_id',
      key: 'course_id',
      render: value => {
        const course = courses.filter(course => {
          const { course_id: id } = course
          if (id === value) {
            return true
          }
        })
        return course[0] && course[0].name
      },
      width: 100
    }, {
      title: '班级', dataIndex: 'class_id', key: 'class_id', width: 100
    }, {
      title: '学号', dataIndex: 'student_id', key: 'student_id', width: 200
    }, {
      title: '姓名', dataIndex: 'name', key: 'name', width: 200
    }, {
      title: '录入时间',
      dataIndex: 'date',
      key: 'date',
      render: value => {
        return <div>
          { value.split(' ')[0] }
        </div>
      },
      width: 200
    }, {
      title: '录入课时',
      dataIndex: 'time_id',
      key: 'time_id',
      render: value => {
        return timesMap[value]
      },
      width: 200
    }, {
      title: '出勤照片',
      dataIndex: 'cur_face_url',
      key: 'cur_face_url',
      render: value => {
        return (
          <div onClick={() => this.showModal(value)}>
            点击查看图片
          </div>
        )
      },
      width: 200
    }]

    const uncallColumns = [
      {
        title: '学号',
        dataIndex: 'student_id',
        key: 'student_id'
      }, {
        title: '姓名', dataIndex: 'name', key: 'name'
      }, {
        title: '班级', dataIndex: 'class_id', key: 'class_id'
      }
    ]

    let coursesMap = {}
    courses.forEach(item => {
      const { course_id, name } = item
      coursesMap = {
        ...coursesMap,
        [course_id]: name
      }
    })

    return (<div className='RollCallInfo'>
      {
        shouldShowModal && <Modal closeModal={this.closeModal} className='RollCallInfo-modal'>
          <img src={modalUrl} alt='face-img' />
        </Modal>
      }
      <span className='RollCallInfo-title'>
        课堂点名信息
      </span>
      <div className='RollCallInfo-Table-header'>
        <Select
          value={coursesMap[courseId]}
          placeholder='请选择相应课程'
          className='RollCallInfo-select'
          style={{ width: 200 }}
          animation='slide-up'
          showSearch={false}
          onChange={this.onSelectionChange}
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
          value={timesMap[timeId]}
          placeholder='请选择课时'
          className='RollCallInfo-select'
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
          placeholderText='请选择对应时间'
          selected={date}
          onChange={this.handleCalendarSelect}
        />
        <input
          value={classId}
          className='RollCallInfo-Class-input'
          type='text'
          placeholder='请输入班级'
          onChange={this.handleClassChange}
        />
        <Button value='确认' className='RollCallInfo-button' handleClick={this.getRollCallTable} disabled={!classId || !courseId || !timeId || !date} />
      </div>
      <Table
        title={() => { return '考勤名单' }}
        footer={() => { return `全班共 ${total} 人,实到 ${realCount} 人` }}
        columns={columns}
        data={records}
        className='RollCallInfo-table'
      />
      {
        Boolean(total - realCount) &&
        <Table
          title={() => { return '未考勤名单' }}
          footer={() => { return `${total - realCount} 人缺勤，有记录 ${uncallStudents.length} 人` }}
          columns={uncallColumns}
          data={uncallStudents}
          className='RollCallInfo-table'
        />
      }
    </div>)
  }
}

RollCallInfoPage.propTypes = {
  courses: PropTypes.array,
  records: PropTypes.array,
  id: PropTypes.string,
  total: PropTypes.any,
  realCount: PropTypes.any,
  uncallStudents: PropTypes.array,
  dispatch: PropTypes.func,
  history: PropTypes.object
}

const mapStateToProps = state => {
  const { user, rollCall } = state
  return {
    ...user,
    ...rollCall
  }
}

export default withRouter(connect(mapStateToProps)(RollCallInfoPage))
