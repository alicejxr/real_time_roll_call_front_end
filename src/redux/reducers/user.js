import { LOAD_STUDENTS } from "../actionTypes";

const initialState = {
  name: 'pororo',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_STUDENTS: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}
