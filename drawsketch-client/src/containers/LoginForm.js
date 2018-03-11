import React, { Component } from "react";
import { PropTypes } from "prop-types";

import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "../style/form.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    // const socket = this.props.socket;

    // socket.emit('login', JSON.stringify(this.state));
    // socket.on('check-login', function(data) {
    //   var parsed = JSON.parse(data);
    //   console.log(parsed);
    // });
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
              <Label>Password</Label>
              <Input 
                id="password"
                value={this.state.password} 
                onChange={this.handleChange} 
                type="password" />
            </FormGroup>
            <Button 
              color="primary" 
              disabled={!this.validateForm()} 
              type="submit" 
              size="lg">
              Login
            </Button>
        </Form>
      </div>
    );
  }
}

Login.contextTypes = {
  websocket: PropTypes.object
}