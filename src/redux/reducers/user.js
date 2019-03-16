import { LOGIN_SUCCESS, LOGOUT } from '../actionTypes'

const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        ...action.payload
      }
    }

    case LOGOUT: {
      return state
    }

    default:
      return state
  }
}
