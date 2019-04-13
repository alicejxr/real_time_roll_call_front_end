import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import Close from '../../svg/close.svg'

import './index.css'

class Modal extends Component {
  componentDidMount () {
    this.props.componentDidMount()
  }

  handleCloseModal = () => {
    const { closeModal } = this.props
    closeModal()
  }

  render () {
    const { className } = this.props
    return ReactDOM.createPortal(
      <div className='Modal'>
        <div className='Modal-mask' onClick={this.handleCloseModal} />
        <div className={cx('Modal-content', className)}>
          <Close className='Modal-closebutton' onClick={this.handleCloseModal} />
          {
            this.props.children
          }
        </div>
      </div>, document.body)
  }
}

Modal.propTypes = {
  className: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  componentDidMount: PropTypes.func,
  children: PropTypes.node
}

export default Modal
