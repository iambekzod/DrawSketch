import React, { Component } from "react";
import { Link } from 'react-router-dom'
import { Button } from "react-bootstrap";
import "../style/form.css";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>DrawSketch</h1>
          <p>A drawing game fun for everyone</p>
          <div className="control-panel">
            <Link to="/login"><Button className="" bsStyle="primary" bsSize="large">Login</Button></Link>
            <Link to="/register"><Button className="btn" bsSize="large">Register</Button></Link>
          </div>    
        </div>
      </div>
    );
  }
}