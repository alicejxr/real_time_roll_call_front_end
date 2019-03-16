import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './index.css'

class SideBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTag: ''
    }
  }

  componentDidMount () {
    this.setState({
      currentTag: window.location.pathname
    })
  }

  setCurrentTag = currentTag => {
    if (currentTag) {
      this.setState({
        currentTag
      })
    }
  }

  render () {
    const { config } = this.props
    const { currentTag } = this.state
    return (<ul className='SideBar'>
      {config.map(item => {
        const { key, value, icon } = item
        const Icon = icon
        return (
          <li
            key={key}
            onClick={() => this.setCurrentTag(key)}
          >
            <Link to={key}
              className={cx('SideBar-item', { 'SideBar-item--active': currentTag === key })}
            >
              { icon && <Icon className='SideBar-icon' /> }
              {value}
            </Link>
          </li>
        )
      })}
    </ul>)
  }
}

SideBar.propTypes = {
  config: PropTypes.array.isRequired
}

SideBar.defaultProps = {
  config: []
}

export default SideBar
