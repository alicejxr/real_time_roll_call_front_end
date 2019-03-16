import { SHOW_MESSAGE, HIDE_MESSAGE } from '../actionTypes'

const initialState = {
  isShown: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_MESSAGE: {
      const { status, message } = action.payload
      return {
        status,
        message,
        isShown: true
      }
    }

    case HIDE_MESSAGE: {
      return {
        ...state,
        isShown: false
      }
    }

    default:
      return state
  }
}
