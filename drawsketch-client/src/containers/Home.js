import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { inject, observer } from "mobx-react";
import { Button } from "reactstrap";
import "../style/form.css";

class Home extends Component {

  componentDidMount() {
    const user = this.props.commonStore.token;
    
    if (user) {
      this.props.history.push("/credits");
    }
  }

  render() {
    const user = this.props.commonStore.token;

    if (!user) {
      return (
        <div className="Home">
          <div className="lander">
            <h1>DrawSketch</h1>
            <p>A drawing game fun for everyone</p>
            <div className="control-panel">
              <Link to="/login"><Button outline color="primary" size="lg">Login</Button></Link>
              <Link to="/register"><Button outline color="primary" size="lg">Register</Button></Link>
            </div> 
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Home = inject('userStore', 'commonStore')(observer(Home))