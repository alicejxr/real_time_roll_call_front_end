import React, { Component } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'

import './index.css'

class Button extends Component {
  render () {
    const { disabled, handleClick, value, type = 'default', className } = this.props
    return (<button
      className={cx('Button', className, {
        'Button--disabled': disabled,
        'Button--cancel': type === 'cancel'
      })}
      disabled={disabled}
      onClick={handleClick}
    >
      {value}
    </button>)
  }
}

Button.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.arrayOf(['default', 'cancel']),
  disabled: PropTypes.bool,
  handleClick: PropTypes.func.isRequired
}

export default Button
