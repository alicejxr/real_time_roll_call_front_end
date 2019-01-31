import { combineReducers } from "redux";
import user from './user'
import rollCall from './rollCall'
import students from './students'
import teachers from './teachers'

export default combineReducers({ user, rollCall, students, teachers});
