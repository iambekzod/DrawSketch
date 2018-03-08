import React, {Component} from "react";
import "./style/App.css";
import Routes from "./Routes";

// https://github.com/benawad/react-native-login
// https://serverless-stack.com/chapters/create-a-login-page.html

class App extends Component {

  render() {
    return (
      <div className="App container">
        <Routes/>
      </div>
    );
  }
}

export default App;