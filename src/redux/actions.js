import { fetch } from 'whatwg-fetch'
import { LOGIN_SUCCESS, LOGOUT, SHOW_MESSAGE, HIDE_MESSAGE, SHOW_MODAL, HIDE_MODAL } from './actionTypes'
import dataURL2File from '../utils/dataURL2File'

const root = 'http://127.0.0.1:7002'

export function saveUserInfo (info) {
  const { data } = info
  return {
    type: LOGIN_SUCCESS,
    payload: {
      ...data
    }
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
        return code
      }
    })
  }
}

export function recognizeFace (dataurl, { studentId, courseId }) {
  return dispatch => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const { id: teacherId, token } = user
    const file = dataURL2File(dataurl, `${studentId}.jpeg`)
    // eslint-disable-next-line no-undef
    const formData = new FormData()
    formData.append('course_id', courseId)
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
      }
    })
  }
}
