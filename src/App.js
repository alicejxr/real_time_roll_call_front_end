import React, { Component } from 'react';
import { connect } from "react-redux";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const {students:{name}} = this.props
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <code>{name}</code>
          </p>
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { students } = state;
  return { students };
};

export default connect(mapStateToProps)(App);
