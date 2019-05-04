import { SAVE_RECORD } from '../actionTypes'

export default function (state = { records: [] }, action) {
  switch (action.type) {
    case SAVE_RECORD: {
      return {
        ...action.payload
      }
    }
    default:
      return state
  }
}
