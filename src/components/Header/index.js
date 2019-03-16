import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'
import Icon from '../../svg/icon.svg'

import './index.css'

class Header extends Component {
  handleLogout = () => {
    const { handleLoginStatus } = this.props
    window.localStorage.removeItem('user')
    window.localStorage.setItem('isLogin', false)
    this.props.dispatch(logout())
    handleLoginStatus(false)
    this.props.history.push('/login')
  }

  render () {
    const { isLogin } = this.props
    const { name } = JSON.parse(window.localStorage.getItem('user')) || ''

    return (
      <div className='Header-wrapper'>
        <header className='Header'>
          <div className='Header-title'>
            <Icon className='Header-icon' />
            实时人脸识别点名系统
          </div>
          <div className='Header-userLine'>
            {
              isLogin && <Fragment>
                <span className='Header-username'>{ name }</span>
                <span className='Header-logout' onClick={this.handleLogout}>退出登录</span>
              </Fragment>
            }
          </div>
        </header>
      </div>

    )
  }
}

Header.propTypes = {
  isLogin: PropTypes.bool,
  handleLoginStatus: PropTypes.func.isRequired,
  history: PropTypes.object,
  dispatch: PropTypes.func
}

Header.defaultProps = {
  isLogin: false
}

const mapStateToProps = state => {
  const { modal } = state
  return { ...modal }
}
export default withRouter(connect(mapStateToProps)(Header))
