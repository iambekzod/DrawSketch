import React, {Component} from "react";
import "./style/App.css";
import Routes from "./Routes";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { inject, observer } from 'mobx-react';

//https://github.com/gothinkster/react-mobx-realworld-example-app/tree/master/src

class App extends Component {

  handleLogout = (e) => {
    e.preventDefault();
    this.props.authStore.logout()
      .then(() => this.props.history.replace('/'));
  };

  componentDidMount() {
    if (this.props.userStore.token) {
      this.props.userStore.pullUser();
    }
  }

  render() {
    const user = this.props.userStore.token;
    
    let toggleSignInOut = (user) ? <NavItem><NavLink href="#" onClick={this.handleLogout} >Sign Out</NavLink></NavItem> : <NavItem><NavLink href="/signin">Sign In</NavLink></NavItem>

    let toggleRegister = (!user) ? <NavItem><NavLink href="/signup">Register</NavLink></NavItem> : null;

    return (
      <div>
        <Navbar color="faded" light expand="md">
          <NavbarBrand className="header" href="/">DrawSketch</NavbarBrand>
            <Nav className="ml-auto">
              <NavItem>
                <NavLink href="/credits">Credits</NavLink>
              </NavItem>
              {toggleSignInOut}
              {toggleRegister}
            </Nav>
        </Navbar>
        <Routes/>
      </div>
    );
  }
}

export default App = inject('userStore', 'authStore')(observer(App))