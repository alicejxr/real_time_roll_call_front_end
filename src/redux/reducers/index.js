import { combineReducers } from 'redux'
import user from './user'
import message from './message'
import modal from './modal'
import rollCall from './rollCall'
import students from './students'
import teachers from './teachers'

export default combineReducers({ user, message, modal, rollCall, students, teachers })
