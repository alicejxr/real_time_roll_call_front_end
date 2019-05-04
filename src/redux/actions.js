/* eslint-disable camelcase */
import { fetch } from 'whatwg-fetch'
import { LOGIN_SUCCESS, LOGOUT, SHOW_MESSAGE, HIDE_MESSAGE, SHOW_MODAL, HIDE_MODAL, SAVE_RECORD, LOAD_STUDENTS } from './actionTypes'
import dataURL2File from '../utils/dataURL2File'
import { stringify } from 'query-string'

const root = 'http://127.0.0.1:7001'

export function saveUserInfo (info) {
  const { data } = info
  return {
    type: LOGIN_SUCCESS,
    payload: {
      ...data
    }
  }
}

export function logout () {
  return {
    type: LOGOUT
  }
}

export function showMessage (info) {
  return {
    type: SHOW_MESSAGE,
    payload: {
      ...info
    }
  }
}

export function hideMessage () {
  return {
    type: HIDE_MESSAGE
  }
}

export function showModal () {
  return {
    type: SHOW_MODAL
  }
}

export function hideModal () {
  return {
    type: HIDE_MODAL
  }
}

export function saveRecord (records) {
  return {
    type: SAVE_RECORD,
    payload: records
  }
}

export function saveStudent (info) {
  return {
    type: LOAD_STUDENTS,
    payload: info
  }
}

export function login ({ id, password, role }) {
  return dispatch => {
    return fetch(`${root}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id, password, role
      })
    }).then(res =>
      res.json()
    ).then(
      json => {
        const { code, message, data } = json
        if (code === 200) {
          const { token, id, role, name } = data
          window.localStorage.setItem('isLogin', true)
          window.localStorage.setItem('user', JSON.stringify({ token, id, role, name }))
          dispatch(saveUserInfo(json))
          dispatch(showMessage({ status: 'success', message }))
        }
        if (code === 400 || code === 404) {
          dispatch(showMessage({ status: 'failure', message }))
        }
      }
    ).catch(e => {
      const { message } = e
      dispatch(showMessage({ status: 'failure', message }))
    })
  }
}

export function uploadFacePicture (dataurl) {
  return dispatch => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { id, token } = user
    const file = dataURL2File(dataurl, `${id}.jpeg`)
    // eslint-disable-next-line no-undef
    const formData = new FormData()
    formData.append('file', file)
    return fetch(`${root}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    }).then(res =>
      res.json()
    ).then(res => {
      const { code, message, data } = res
      if (code === 200) {
        Promise.all([dispatch(saveUserInfo({ data })), dispatch(showMessage({ status: 'success', message }))])
      } else {
        dispatch(showMessage({ status: 'warning', message }))
      }
      return code
    })
  }
}

export function recognizeFace (dataurl, { studentId, courseId, date, timeId }) {
  return dispatch => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { id: teacherId, token } = user
    const file = dataURL2File(dataurl, `${studentId}.jpeg`)
    // eslint-disable-next-line no-undef
    const formData = new FormData()
    formData.append('course_id', courseId)
    formData.append('date', date)
    formData.append('time_id', timeId)
    formData.append('file', file)
    return fetch(`${root}/recognize/${teacherId}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    }).then(res =>
      res.json()
    ).then(res => {
      const { code, message } = res
      if (code === 200) {
        dispatch(showMessage({ status: 'success', message }))
        return code
      } else {
        dispatch(showMessage({ status: 'failure', message }))
      }
    })
  }
}

export function getRecords (params) {
  return dispatch => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { token } = user
    return fetch(`${root}/record?${stringify(params)}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(res =>
      res.json()
    ).then(
      json => {
        const { data: { records = [], total, real_count, uncall_students } } = json
        let finalRecords = records
        let finalUncall = uncall_students

        if (records.length) {
          finalRecords = records.map((record, index) => {
            return {
              ...record,
              key: index
            }
          })
        }

        if (uncall_students.length) {
          finalUncall = uncall_students.map((student, index) => {
            return {
              ...student,
              key: index
            }
          })
        }

        dispatch(saveRecord({
          records: finalRecords,
          total,
          realCount: real_count,
          uncallStudents: finalUncall
        }))
      }
    ).catch(e => {
      const { message } = e
      dispatch(showMessage({ status: 'failure', message }))
    })
  }
}

export function getStudent (studentId) {
  return dispatch => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { token, id } = user
    return fetch(`${root}/student/${studentId}?teacher_id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(res =>
      res.json()
    ).then(
      json => {
        const { data, code, message } = json
        if (code === 200) {
          dispatch(saveStudent(data))
          return data
        } else {
          dispatch(showMessage({ status: 'failure', message }))
          return null
        }
      }
    ).catch(e => {
      const { message } = e
      dispatch(showMessage({ status: 'failure', message }))
    })
  }
}

export function changeStudentInfo (params) {
  return dispatch => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { token } = user
    return fetch(`${root}/modify`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...params
      })
    }).then(res =>
      res.json()
    ).then(
      json => {
        const { data, code } = json
        console.log(data)
        if (code === 200) {
          dispatch(saveStudent(data))
          dispatch(showMessage({ status: 'success', message: '修改成功' }))
        }
        return code
      }
    ).catch(e => {
      const { message } = e
      dispatch(showMessage({ status: 'failure', message }))
    })
  }
}

export function resetPassword (studentId) {
  return dispatch => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { token, id } = user
    return fetch(`${root}/reset/${studentId}?teacher_id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(res =>
      res.json()
    ).then(
      json => {
        const { code, message } = json
        dispatch(showMessage({ status: code === 200 ? 'success' : 'failure', message }))
      }
    ).catch(e => {
      const { message } = e
      dispatch(showMessage({ status: 'failure', message }))
    })
  }
}

export function addStudent (body) {
  return dispatch => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { token } = user
    return fetch(`${root}/create`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...body
      })
    }).then(res =>
      res.json()
    ).then(
      json => {
        const { code, message } = json
        dispatch(showMessage({ status: code === 200 ? 'success' : 'failure', message }))
      }
    ).catch(e => {
      const { message } = e
      dispatch(showMessage({ status: 'failure', message }))
    })
  }
}

export function modifyPassword (body) {
  return dispatch => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { token } = user
    return fetch(`${root}/password`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...body
      })
    }).then(res =>
      res.json()
    ).then(
      json => {
        const { code, message } = json
        dispatch(showMessage({ status: code === 200 ? 'success' : 'failure', message }))
        return code
      }
    ).catch(e => {
      const { message } = e
      dispatch(showMessage({ status: 'failure', message }))
    })
  }
}
