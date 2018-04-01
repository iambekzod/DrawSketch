import React, {Component} from "react";
import "./style/App.css";

import Routes from "./Routes";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { inject, observer } from 'mobx-react';

//https://github.com/gothinkster/react-mobx-realworld-example-app/tree/master/src

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
        user: null
    };
  }

  handleLogout = (e) => {
    e.preventDefault();

    var self = this;
    this.props.authStore.logout()
      .then(() => { this.props.history.replace('/') 
      self.setState({
        user: null
      });
    });
  };

  componentDidMount() {
    var self = this;
    if (this.props.userStore.token) {
      this.props.userStore.pullUser().then(function (resultUser) {
        self.setState({
          user: resultUser
        });
      });    
    }
  }

  render() {
    
    let toggleSignInOut = (this.state.user) ? <NavItem><NavLink href="#" onClick={this.handleLogout} >Sign Out</NavLink></NavItem> : <NavItem><NavLink href="/signin">Sign In</NavLink></NavItem>

    let toggleRegister = (!this.state.user) ? <NavItem><NavLink href="/signup">Register</NavLink></NavItem> : null;

    let showUsername = (this.state.user) ? <NavItem className="user">Hi, {this.state.user.username}</NavItem> : null;

    return (
      <div>
        <Navbar color="faded" light expand="md">
          <NavbarBrand className="header" href="/">DrawSketch</NavbarBrand>
            <Nav className="ml-auto">
              {showUsername}
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