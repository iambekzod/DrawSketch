import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import "../style/form.css";

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
        user: null
    };
  }

  componentDidMount() {
    var self = this;
    if (this.props.userStore.token) {
      this.props.userStore.pullUser().then(function (resultUser) {
        self.setState({
          user: resultUser
        });
      });    
    }
  }

  render() {
    if (!this.state.user) {
      return (
        <div className="Home">
          <div className="lander">
            <h1>DrawSketch</h1>
            <p>A drawing game fun for everyone</p>
          </div>
        </div>
      );
    } else {
      var newPath = "/lobby";
      if (this.state.user.username === "") {
        newPath = "/username";
      }

      this.props.history.push(newPath);
      return null;
    }
  }
}

export default Home = inject('userStore', 'lobbyStore')(observer(Home))