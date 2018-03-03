import React, { Component } from "react";
import "./style/Main.css";
import Form from "./Form";

//https://github.com/benawad/react-native-login

class Main extends Component {
  state = {
    fields: {}
  };

  onChange = updatedValue => {
    this.setState({
      fields: {
        ...this.state.fields,
        ...updatedValue
      }
    });
  };

  render() {
    return (
      <div className="Main">
        <Form onChange={fields => this.onChange(fields)} />
      </div>
    );
  }
}

export default Main;