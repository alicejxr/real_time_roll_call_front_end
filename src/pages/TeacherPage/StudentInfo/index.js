/* eslint-disable camelcase */
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { stringify, parseUrl } from 'query-string'

import { getStudent, changeStudentInfo, resetPassword, addStudent } from '../../../redux/actions'
import Modal from '../../../components/Modal'
import Button from '../../../components/Button'

import './index.css'

class StudentInfoPage extends Component {
  state = {
    studentId: '',
    editStudentId: '',
    editClassId: '',
    editName: '',
    addStudentId: '',
    addClassId: '',
    addName: '',
    shouldShowModal: false,
    showAddModal: false,
    shouldShowInfo: false
  }

  componentDidMount () {
    const {
      query: {
        // eslint-disable-next-line comma-dangle
        student_id,
      }
    } = parseUrl(window.location.href)
    if (window.location.search) {
      this.setState({
        studentId: student_id
      })
      this.props.dispatch(getStudent(student_id)).then(res => {
        if (res) {
          const { class_id, student_id, name } = res
          this.setState({
            shouldShowInfo: true,
            studentId: student_id,
            editStudentId: student_id,
            editClassId: class_id,
            editName: name
          })
        }
      })
    }
  }

  getStudentInfo = () => {
    const { studentId } = this.state
    const { history, dispatch } = this.props
    history.push(`/teacher/student?${stringify({ student_id: studentId })}`)
    dispatch(getStudent(studentId)).then(res => {
      if (res) {
        const { class_id, student_id, name } = res
        this.setState({
          shouldShowInfo: true,
          studentId: student_id,
          editStudentId: student_id,
          editClassId: class_id,
          editName: name
        })
      }
    })
  }

  addStudent = () => {
    const {
      addStudentId: student_id,
      addClassId: class_id,
      addName: name
    } = this.state

    const { user: { id } } = this.props

    const body = {
      student_id,
      class_id,
      name,
      teacher_id: id
    }

    this.props.dispatch(addStudent(body))
  }

  handleStudentIdChange = e => {
    this.setState({
      studentId: e.target.value
    })
  }

  handleEditStudentIdChange = e => {
    this.setState({
      editStudentId: e.target.value
    })
  }

  handleClassIdChange = e => {
    this.setState({
      editClassId: e.target.value
    })
  }

  handleNameChange = e => {
    this.setState({
      editName: e.target.value
    })
  }

  handleAddStudentIdChange = e => {
    this.setState({
      addStudentId: e.target.value
    })
  }

  handleAddClassIdChange = e => {
    this.setState({
      addClassId: e.target.value
    })
  }

  handleAddNameChange = e => {
    this.setState({
      addName: e.target.value
    })
  }

  changeStudentInfo = () => {
    const { editClassId, editStudentId, editName } = this.state
    const { user: { id } } = this.props
    const params = {
      class_id: Number(editClassId),
      student_id: Number(editStudentId),
      name: editName,
      teacher_id: id
    }
    this.props.dispatch(changeStudentInfo(params)).then(res => {
      if (res === 200) {
        this.closeModal()
      }
    })
  }

  resetPassword = () => {
    const { studentId } = this.state
    this.props.dispatch(resetPassword(studentId))
  }

  closeModal = () => {
    this.setState({
      shouldShowModal: false
    })
  }

  closeAddModal = () => {
    this.setState({
      showAddModal: false
    })
  }

  showModal = () => {
    this.setState({
      shouldShowModal: true
    })
  }

  showAddModal = () => {
    this.setState({
      showAddModal: true
    })
  }

  render () {
    const { shouldShowModal, showAddModal, studentId, editStudentId, shouldShowInfo, editName, editClassId, addClassId, addName, addStudentId } = this.state
    // eslint-disable-next-line no-unused-vars
    const { name, class_id, face_url: faceUrl, student_id } = this.props

    return (<div className='StudentInfo'>
      {
        shouldShowModal && <Modal closeModal={this.closeModal} className='StudentInfo-modal'>
          <div className='StudentInfo-form'>
            <label className='StudentInfo-form-item'>
              <span className='StudentInfo-form-item-name'>班级:</span>
              <input className='StudentInfo-form-item-input' type='text' value={editClassId} onChange={this.handleClassIdChange} />
            </label>
            <label className='StudentInfo-form-item'>
              <span className='StudentInfo-form-item-name'>学号:</span>
              <input className='StudentInfo-form-item-input' type='text' value={editStudentId} onChange={this.handleEditStudentIdChange} />
            </label>
            <label className='StudentInfo-form-item'>
              <span className='StudentInfo-form-item-name'>姓名:</span>
              <input className='StudentInfo-form-item-input' type='text' value={editName} onChange={this.handleNameChange} />
            </label>
            <Button className='StudentInfo-form-button' disabled={!editClassId || !editStudentId || !editName} handleClick={this.changeStudentInfo} value='确认修改' />
          </div>
        </Modal>
      }
      {
        showAddModal && <Modal closeModal={this.closeAddModal} className='StudentInfo-modal'>
          <div className='StudentInfo-form'>
            <label className='StudentInfo-form-item'>
              <span className='StudentInfo-form-item-name'>班级:</span>
              <input className='StudentInfo-form-item-input' type='text' value={addClassId} onChange={this.handleAddClassIdChange} />
            </label>
            <label className='StudentInfo-form-item'>
              <span className='StudentInfo-form-item-name'>学号:</span>
              <input className='StudentInfo-form-item-input' type='text' value={addStudentId} onChange={this.handleAddStudentIdChange} />
            </label>
            <label className='StudentInfo-form-item'>
              <span className='StudentInfo-form-item-name'>姓名:</span>
              <input className='StudentInfo-form-item-input' type='text' value={addName} onChange={this.handleAddNameChange} />
            </label>
            <Button className='StudentInfo-form-button' disabled={!addClassId || !addStudentId || !addName} handleClick={this.addStudent} value='确认添加' />
          </div>
        </Modal>
      }
      <span className='StudentInfo-title'>
        管理学生信息
      </span>
      <div className='StudentInfo-Table-header'>
        <input
          value={studentId || ''}
          className='StudentInfo-Class-input'
          type='text'
          placeholder='请输入学生学号'
          onChange={this.handleStudentIdChange}
        />
        <Button value='确认查询' className='StudentInfo-button' handleClick={this.getStudentInfo} disabled={!studentId} />
        <Button value='添加学生' className='StudentInfo-add' handleClick={this.showAddModal} />
      </div>
      {
        shouldShowInfo ? <div className='StudentInfo-content'>
          <img src={faceUrl + '?' + Math.random() * 100} alt='face-img' width='300' height='400' />
          <div className='StudentInfo-text'>
            <div className='StudentInfo-item'>
              <span className='StudentInfo-key'>班级: </span>
              <span className='StudentInfo-value'>{class_id}</span>
            </div>
            <div className='StudentInfo-item'>
              <span className='StudentInfo-key'>学号: </span>
              <span className='StudentInfo-value'>{student_id}</span>
            </div>
            <div className='StudentInfo-item'>
              <span className='StudentInfo-key'>姓名: </span>
              <span className='StudentInfo-value'>{name}</span>
            </div>
            <Button value='点击编辑' className='StudentInfo-eidt' handleClick={this.showModal} />
            <Button className='StudentInfo-eidt' handleClick={this.resetPassword} value='点击重置密码为学号' />
          </div>
        </div> : <p className='StudentInfo-empty'>
            请输入学生学号查询学生信息
        </p>
      }
    </div>)
  }
}

StudentInfoPage.propTypes = {
  user: PropTypes.object,
  student_id: PropTypes.any,
  name: PropTypes.string,
  face_url: PropTypes.string,
  class_id: PropTypes.any,
  dispatch: PropTypes.func,
  history: PropTypes.object
}

const mapStateToProps = state => {
  const { students, user } = state
  return {
    user,
    ...students
  }
}

export default withRouter(connect(mapStateToProps)(StudentInfoPage))
