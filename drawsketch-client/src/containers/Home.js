import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import "../style/form.css";

class Home extends Component {

  render() {
    const user = this.props.userStore.token;

    if (!user) {
      return (
        <div className="Home">
          <div className="lander">
            <h1>DrawSketch</h1>
            <p>A drawing game fun for everyone</p>
          </div>
        </div>
      );
    } else {
      this.props.history.push("/lobby");
      return null;
    }
  }
}

export default Home = inject('userStore', 'lobbyStore')(observer(Home))