import React, { Component } from "react";
import { Link } from 'react-router-dom'
import { Button } from "reactstrap";
import "../style/form.css";

export default class Home extends Component {
  render() {
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
  }
}