import React, {Component} from "react";
import "./style/App.css";
import Routes from "./Routes";
import { Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

// https://github.com/benawad/react-native-login
// https://serverless-stack.com/chapters/create-a-login-page.html

class App extends Component {

  render() {
    return (
      <div >
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/">DrawSketch</NavbarBrand>
          <NavbarToggler/>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/credits">Credits</NavLink>
              </NavItem>
            </Nav>
        </Navbar>
        <Routes/>
      </div>
    );
  }
}

export default App;