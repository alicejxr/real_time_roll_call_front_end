import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import Close from '../../svg/close.svg'

import './index.css'

class LoginModal extends Component {
    state = {
      currentRole: 'student',
      id: '',
      password: ''
    }

  handleCloseModal = () => {
    const { closeModal } = this.props
    closeModal(false)
  }

  render () {
    const { isOpen } = this.props

    return isOpen ? ReactDOM.createPortal(<div className='login-modal'>
      <div className='login-mask' onClick={this.handleCloseModal} />
      <div className='login-content'>
        <Close className='login-closebutton' onClick={this.handleCloseModal} />
        {
          this.props.children
        }
      </div>
    </div>, document.body) : null
  }
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  // dispatch: PropTypes.func,
  children: PropTypes.node
}

LoginModal.defaultProps = {
  isOpen: true
}

const mapStateToProps = state => {
  const { students } = state
  return { students }
}

export default connect(mapStateToProps)(LoginModal)
