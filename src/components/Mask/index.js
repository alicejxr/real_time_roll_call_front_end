import React, { Component } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'

import './index.css'

class Mask extends Component {
  state = {
    isHidden: true
  }

  handleMouseOver = () => {
    this.setState({
      isHidden: false
    })
  }

  handleMouseOut = () => {
    this.setState({
      isHidden: true
    })
  }

  render () {
    const { className, handleMaskClick, children } = this.props
    const { isHidden } = this.state
    return (<div
      className={cx('Mask-wrapper', { 'Mask--hidden': isHidden })}
      onClick={handleMaskClick}
      onMouseOver={this.handleMouseOver}
      onMouseOut={this.handleMouseOut}
    >
      <div className='Mask' />
      <div className={cx('Mask-children', className)}>
        {
          children
        }
      </div>
    </div>)
  }
}

Mask.propTypes = {
  className: PropTypes.string,
  handleMaskClick: PropTypes.func,
  children: PropTypes.node
}

export default Mask
