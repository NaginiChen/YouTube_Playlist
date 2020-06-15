import React, { Component } from "react";
import axios from 'axios';
import './app.scss';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      channel: "",
      playlist: "",
      token: "",
      apiResponse: ""
    }
  }

  callApi() {
    axios({
      method: 'post',
      url: 'http://localhost:9000/youtubeAPI',
      data: {
        token: this.state.token,
        channel: this.state.channel,
        playlist: this.state.playlist
      }
    }).then(res => console.log(res))

  }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;

    switch (name) {
      case 'username':
        this.setState(prevState => ({
          ...prevState,
          username: value
        }));
        break;
      case 'channel':
        this.setState(prevState => ({
          ...prevState,
          channel: value
        }));
        break;
      case 'playlist':
        this.setState(prevState => ({
          ...prevState,
          playlist: value
        }));
        break;
      default:
        break;
    }
    console.log(this.state);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.callApi();
  }

  render() {
    return (
      <div className="container">
        <p>Insert a username or channel ID. Hit submit to include the next 50 videos</p>

        <form>
          <label>Username</label>
          <input type="text" name="username" onChange={this.handleChange}></input>
          <label>Channel ID</label>
          <input type="text" name="channel" onChange={this.handleChange}></input>
          <label>Playlist Name</label>
          <input type="text" name="playlist" onChange={this.handleChange}></input>
          <input type="submit" value="Submit" onClick={this.handleSubmit}></input>
        </form>

        <div className="playlist_container">

          <p>{this.state.apiResponse}</p>

        </div>

      </div>
    );
  }
}

