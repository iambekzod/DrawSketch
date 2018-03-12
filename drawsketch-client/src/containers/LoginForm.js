import React, { Component } from "react";

import ResultErrors from "./ResultErrors";

import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "../style/form.css";
import { inject, observer } from 'mobx-react';

class Login extends Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleEmailChange = e => this.props.authStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.login()
      .then(() => this.props.history.replace('/'));
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="Login">
        <ResultErrors errors={errors} />

        <Form onSubmit={this.handleSubmitForm}>
          <FormGroup>
              <Label>Username</Label>
              <Input 
                id="username"
                autoFocus
                placeholder="Username"
                value={values.email}
                onChange={this.handleEmailChange} />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input 
                id="password"
                placeholder="Password"
                value={values.password}
                onChange={this.handlePasswordChange}
                type="password" />
            </FormGroup>
            <Button 
              color="primary" 
              disabled={inProgress}
              type="submit" 
              size="lg">
              Login
            </Button>
        </Form>
      </div>
    );
  }
}

export default Login = inject('authStore')(observer(Login))