import { fetch } from 'whatwg-fetch'
import { LOGIN_SUCCESS, LOGOUT, SHOW_MESSAGE, HIDE_MESSAGE, SHOW_MODAL, HIDE_MODAL } from './actionTypes'

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
