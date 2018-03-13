import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { inject, observer } from "mobx-react";
import { Button } from "reactstrap";
import "../style/form.css";

class Home extends Component {

  render() {
    const user = this.props.userStore.token;

    let cPanel = (user) ? <div className="control-panel">
                            <Link to="/game"><Button color="primary" size="lg">Proceed to Game</Button>
                            </Link>
                           </div> : null;

    return (
      <div className="Home">
        <div className="lander">
          <h1>DrawSketch</h1>
          <p>A drawing game fun for everyone</p>
          {cPanel}
        </div>
      </div>
    );
  }
}

export default Home = inject('userStore')(observer(Home))