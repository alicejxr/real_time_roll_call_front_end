import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import './index.css'

class TeacherPage extends Component {
  render () {
    const { students: { name } } = this.props
    return (
      <div className='App'>
        TeachersPage{name}
      </div>
    )
  }
}

TeacherPage.propTypes = {
  students: PropTypes.object
}

const mapStateToProps = state => {
  const { students } = state
  return { students }
}

export default connect(mapStateToProps)(TeacherPage)
