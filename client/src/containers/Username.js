// import Cookies from 'universal-cookie';
import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "../style/form.css";

import LoadingSpinner from "./LoadingSpinner";
import ResultErrors from "./ResultErrors";
import { inject, observer } from 'mobx-react';

class Username extends Component {

  handleUsernameChange = e => this.props.authStore.setUsername(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.updateGoogleUsername()
      .then((user) => { 
        this.props.userStore.setToken(user.token);
        this.props.userStore.pullUser().then(() => this.props.history.replace('/lobby'));
      });
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="sign-up">
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
          <Button 
              color="primary" 
              disabled={inProgress} 
              type="submit" 
              size="lg"
              block>
              Set Username
            </Button>
        </Form>

        <LoadingSpinner inProgress={inProgress}/>
      </div>
    );
  }
}

export default Username = inject('authStore','userStore')(observer(Username))