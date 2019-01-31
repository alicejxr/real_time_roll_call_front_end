import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import LoginPage from './pages/LoginPage'
import RollCallPage from './pages/RollCallPage'
import StudentsPage from './pages/StudentsPage'
import TeachersPage from './pages/TeachersPage'
import './App.css';

class App extends Component {
  render() {
    const {user:{name}} = this.props
    return (
      <div className="App">
        <header className="App-header">
          header {name}
        </header>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/roll-call" component={RollCallPage} />
          <Route path="/students/:id" component={StudentsPage} />
          <Route path="/teachers/:id" component={TeachersPage} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state;
  return { user };
};

export default connect(mapStateToProps)(App);
