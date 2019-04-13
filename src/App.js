import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import { fetch } from 'whatwg-fetch'
import { connect } from 'react-redux'
import { saveUserInfo, showMessage, logout } from './redux/actions'
import Header from './components/Header'
import Message from './components/Message'
import LoginePage from './pages/LoginPage'
import StudentPage from './pages/StudentPage'
import TeacherPage from './pages/TeacherPage'

import './App.css'

const root = 'http://127.0.0.1:7001'

class App extends Component {
  state = {
    isLogin: false
  }

  componentDidMount () {
    this.setState({
      isLogin: window.localStorage.getItem('isLogin') !== 'false'
    })

    if (window.localStorage.getItem('isLogin') === null) {
      window.localStorage.setItem('isLogin', false)
    }

    if (window.localStorage.getItem('isLogin') === 'true') {
      const user = JSON.parse(window.localStorage.getItem('user'))
      const { id, token, role } = user

      fetch(`${root}/verify/${id}/${role}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(
        res => res.json()
      ).then(
        res => {
          this.props.dispatch(saveUserInfo(res))
          if (window.location.pathname === '/') {
            this.props.history.push(`/${role}`)
          }
        }
      ).catch(() => {
        this.props.dispatch(showMessage({ status: 'failure', message: '登录过期请重新登录！' }))
        window.localStorage.removeItem('user')
        window.localStorage.setItem('isLogin', false)
        this.props.dispatch(logout())
        this.handleLoginStatus(false)
        this.props.history.push('/login')
      })
    } else {
      this.props.history.push('/login')
    }
  }

  handleLoginStatus = isLogin => {
    this.setState({
      isLogin
    })
  }

  render () {
    const { isLogin } = this.state
    const { isShown } = this.props
    return (
      <div className='App'>
        <Header handleLoginStatus={this.handleLoginStatus} isLogin={isLogin} />
        { isShown && <Message />}
        <Switch>
          <Route path='/login' render={props => <LoginePage {...props} handleLoginStatus={this.handleLoginStatus} isLogin={isLogin} />} />
          <Route path='/student' component={StudentPage} />
          <Route path='/teacher' component={TeacherPage} />
        </Switch>
      </div>
    )
  }
}

App.propTypes = {
  isShown: PropTypes.bool.isRequired,
  dispatch: PropTypes.func,
  history: PropTypes.object
}

const mapStateToProps = state => {
  const { message: { isShown } } = state
  return {
    isShown
  }
}

export default withRouter(connect(mapStateToProps)(App))
