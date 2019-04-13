import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { login } from '../../redux/actions'
import Tags from '../../components/Tags'
import Button from '../../components/Button'

import './index.css'

class LoginPage extends Component {
  state = {
    currentRole: (
      JSON.parse(window.localStorage.getItem('user')) &&
    JSON.parse(window.localStorage.getItem('user')).role
    ) || 'student',
    id: '',
    password: ''
  }

  onTagChange = currentRole => {
    this.setState({ currentRole })
  }

  handleIdChange = e => {
    const { target: { value } } = e
    this.setState({
      id: value
    })
  }

  handlePasswordChange = e => {
    const { target: { value } } = e
    this.setState({
      password: value
    })
  }

  handleSubmit = () => {
    const { id, currentRole, password } = this.state
    const { handleLoginStatus } = this.props
    const body = {
      role: currentRole,
      id,
      password
    }

    this.props.dispatch(login(body)).then(() => {
      const { user } = this.props
      const isLogin = user.name || false
      if (isLogin) {
        handleLoginStatus(true)
        this.props.history.push(`/${currentRole}`)
      }
    })
  }

  render () {
    const { id, password, currentRole } = this.state
    const { isLogin } = this.props

    if (isLogin) {
      // eslint-disable-next-line no-unused-expressions
      return <Redirect to={`/${currentRole}`} />
    }

    return (ReactDOM.createPortal(<div className='LoginPage'>
      <div className='Login-content'>
        <Tags tags={[{ key: 'student', value: '学生登录' }, { key: 'teacher', value: '教师登录' }]} onTagChange={this.onTagChange} />
        <div className='Login-form'>
          <label className='Login-item'>
            <span className='Login-item-name'>账户:</span>
            <input className='Login-item-input' type='text' value={id} onChange={this.handleIdChange} />
          </label>
          <label className='Login-item'>
            <span className='Login-item-name'>密码:</span>
            <input className='Login-item-input' type='password' value={password} onChange={this.handlePasswordChange} />
          </label>
          <Button className='Login-button' disabled={!id || !password} handleClick={this.handleSubmit} value='登录' />
        </div>
      </div>
    </div>, document.body))
  }
}

LoginPage.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  user: PropTypes.object,
  handleLoginStatus: PropTypes.func.isRequired,
  history: PropTypes.object,
  dispatch: PropTypes.func
}

const mapStateToProps = (state) => {
  const { user } = state
  return {
    user
  }
}

export default withRouter(connect(mapStateToProps)(LoginPage))
