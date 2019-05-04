import { LOAD_STUDENTS } from '../actionTypes'

export default function (state = {}, action) {
  switch (action.type) {
    case LOAD_STUDENTS: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}
