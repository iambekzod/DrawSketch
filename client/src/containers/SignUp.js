import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "../style/form.css";

import LoadingSpinner from "./LoadingSpinner";
import ResultErrors from "./ResultErrors";
import { inject, observer } from 'mobx-react';
import { Link } from "react-router-dom";

class SignUp extends Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleUsernameChange = e => this.props.authStore.setUsername(e.target.value);
  handleFirstnameChange = e => this.props.authStore.setFirstname(e.target.value);
  handleLastnameChange = e => this.props.authStore.setLastname(e.target.value);
  handleEmailChange = e => this.props.authStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleConfirmPasswordChange = e => this.props.authStore.setConfirmPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.register()
      .then(() => this.props.history.replace('/'));
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="sign-up">
        <div className="control-panel">
          <h1>Register</h1>
          <Link to="/signin">Already have an account?</Link>
        </div>

        <ResultErrors errors={errors} />

        <Button 
              color="primary" 
              disabled={inProgress} 
              type="submit" 
              size="lg"
              href='/api/user/signup/google'
              block>
              Google+
        </Button>

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
              <Label>First Name</Label>
              <Input 
                id="firstname"
                bsSize="lg"
                value={values.firstname} 
                onChange={this.handleFirstnameChange} />
            </FormGroup>
            <FormGroup>
              <Label>Last Name</Label>
              <Input 
                id="lastname"
                bsSize="lg"
                value={values.lastname} 
                onChange={this.handleLastnameChange} />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input 
                id="email"
                type="email"
                bsSize="lg"
                value={values.email} 
                onChange={this.handleEmailChange} />
            </FormGroup>
            <FormGroup>
            <Label>Password</Label>
            <Input 
              id="password"
              type="password"
              bsSize="lg"
              value={values.password} 
              onChange={this.handlePasswordChange} />
          </FormGroup>
          <FormGroup>
            <Label>Confirm Password</Label>
            <Input 
              id="confirmpassword"
              type="password"
              bsSize="lg"
              value={values.confirmPassword} 
              onChange={this.handleConfirmPasswordChange} />
          </FormGroup>
          <Button 
              color="primary" 
              disabled={inProgress} 
              type="submit" 
              size="lg"
              block>
              Sign Up
            </Button>
        </Form>

        <LoadingSpinner inProgress={inProgress}/>
      </div>
    );
  }
}

export default SignUp = inject('authStore')(observer(SignUp))