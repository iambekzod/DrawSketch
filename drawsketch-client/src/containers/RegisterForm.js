import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
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
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
              <Label>Username</Label>
              <Input 
                id="username"
                autoFocus
                value={this.state.username} 
                onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>First Name</Label>
              <Input 
                id="firstname"
                value={this.state.firstname} 
                onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Last Name</Label>
              <Input 
                id="lastname"
                value={this.state.lastname} 
                onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input 
                id="email"
                type="email"
                value={this.state.email} 
                onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
            <Label>Password</Label>
            <Input 
              id="password"
              type="password" 
              value={this.state.password} 
              onChange={this.handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>Confirm Password</Label>
            <Input 
              id="confirmpassword"
              type="password" 
              value={this.state.confirmpassword} 
              onChange={this.handleChange} />
          </FormGroup>
          <Button 
              color="primary" 
              disabled={!this.validateForm()} 
              type="submit" 
              size="lg">
              Register
            </Button>
        </Form>
      </div>
    );
  }
}