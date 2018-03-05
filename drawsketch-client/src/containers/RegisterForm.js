import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "../style/form.css";
import socket from "./Socket"

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.firstname.length > 0 &&
           this.state.lastname.length > 0 && this.state.email.length > 0 && 
           this.state.password.length > 0 && this.state.confirmpassword.length > 0 &&
           this.state.password === this.state.confirmpassword;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    socket.emit('register', JSON.stringify(this.state));
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="firstname" bsSize="large">
            <ControlLabel>First Name</ControlLabel>
            <FormControl
              value={this.state.firstname}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="lastname" bsSize="large">
            <ControlLabel>Last Name</ControlLabel>
            <FormControl
              value={this.state.lastname}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              value={this.state.email}
              onChange={this.handleChange}
              type="email"
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>          
          <FormGroup controlId="confirmpassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={this.state.confirmpassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >Register</Button>
        </form>
      </div>
    );
  }
}