import React, {Component} from "react";
import "./style/App.css";
import Routes from "./Routes";
import {observableTodoStore, TodoList} from "./containers/Game"

// https://github.com/benawad/react-native-login
// https://serverless-stack.com/chapters/create-a-login-page.html

class App extends Component {

  render() {
    console.log(observableTodoStore);
    return (
      <div className="App container">
        <TodoList store={observableTodoStore}/>
        <a href="/" className="header">DrawSketch</a>
        <Routes/>
      </div>
    );
  }
}

export default App;