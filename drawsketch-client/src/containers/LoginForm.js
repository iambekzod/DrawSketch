import React, { Component } from "react";
import "../style/form.css";

import ResultErrors from "./ResultErrors";
import LoadingSpinner from "./LoadingSpinner";

import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { inject, observer } from 'mobx-react';

class Login extends Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleUsernameChange = e => this.props.authStore.setUsername(e.target.value);
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
                value={values.username}
                onChange={this.handleUsernameChange} />
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
              size="lg"
              block>
              Login
            </Button>
        </Form>

        <LoadingSpinner inProgress={inProgress}/>
      </div>
    );
  }
}

export default Login = inject('authStore')(observer(Login))