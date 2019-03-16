import { SHOW_MODAL, HIDE_MODAL } from '../actionTypes'

const initialState = {
  isOpen: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_MODAL: {
      return {
        isOpen: true
      }
    }

    case HIDE_MODAL: {
      return {
        isOpen: false
      }
    }

    default:
      return state
  }
}
