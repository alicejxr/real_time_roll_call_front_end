import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { hideMessage } from '../../redux/actions'
import Success from '../../svg/success.svg'
import Warning from '../../svg/warning.svg'
import Failure from '../../svg/failure.svg'

import './index.css'

const icon = {
  success: Success,
  warning: Warning,
  failure: Failure
}

class Message extends Component {
  componentDidMount () {
    this.timer = setTimeout(() => this.props.dispatch(hideMessage()), 2000)
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
  }

  render () {
    const { status, message } = this.props
    const Icon = icon[status]
    return ReactDOM.createPortal(<div className='Message-wrapper'>
      <Icon />
      <p className='Message-text'>
        {message}
      </p>
    </div>, document.body)
  }
}

Message.propTypes = {
  status: PropTypes.oneOf(['success', 'warning', 'failure']).isRequired,
  message: PropTypes.string.isRequired,
  dispatch: PropTypes.func
}

const mapStateToProps = state => {
  const { message } = state
  return { ...message }
}

export default connect(mapStateToProps)(Message)
