import React, { Component } from "react";
import "./style/App.css";
import Routes from "./Routes";
import { ToDoList, ObservableTodoStore } from "containers/Game.js"

//https://github.com/benawad/react-native-login
//https://serverless-stack.com/chapters/create-a-login-page.html

class App extends Component {

  render() {
    return (
      <div className="App container">
        <ToDoList store={ObservableTodoStore} />
        <a href="/" className="header">DrawSketch</a>
        <Routes />
      </div>
    );
  }
}

export default App;