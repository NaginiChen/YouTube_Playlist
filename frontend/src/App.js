import React, { Component } from "react"
import './app.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div className="container">
        <form>
          <label>Username</label>
          <input type="text" name="user"></input>
          <label>Channel ID</label>
          <input type="text" name="channel"></input>
        </form>
      </div>
    );
  }
}

