import React, { Component } from "react";
import "../style/form.css";

import ResultErrors from "./ResultErrors";
import LoadingSpinner from "./LoadingSpinner";

import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';

class SignIn extends Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleUsernameChange = e => this.props.authStore.setUsername(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.login()
      .then(() => this.props.history.replace('/lobby'));
  };

  responseGoogle = (response) => {
    this.props.authStore.verifyGoogleToken(response.tokenId)
      .then((result) => {

        if (result.redirect) {
          this.props.userStore.setGoogleToken(result.token);
          this.props.history.replace("/username");
        } else {
          this.props.userStore.setToken(result.token);
          this.props.userStore.pullUser().then((user) => {
            this.props.history.replace("/lobby");
          });
        }
      });
  }

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="sign-in">
        <div className="control-panel">
          <h1>Sign In</h1>
          <Link to="/signup">Need an account?</Link>
        </div>

        <ResultErrors errors={errors} />

        <Form onSubmit={this.handleSubmitForm}>
          <FormGroup>
              <Label>Username</Label>
              <Input 
                id="username"
                autoFocus
                bsSize="lg"
                value={values.username}
                onChange={this.handleUsernameChange} />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input 
                id="password"
                bsSize="lg"
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
              Sign In
            </Button>

            <GoogleLogin
                clientId="961751684480-o11bdd2778v499aq8v7tcv2vcvent1qu.apps.googleusercontent.com"
                className="btn btn-primary btn-lg btn-block"
                buttonText="Sign In with Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
              />
        </Form>

        <LoadingSpinner inProgress={inProgress}/>
      </div>
    );
  }
}

export default SignIn = inject('authStore', 'userStore')(observer(SignIn))