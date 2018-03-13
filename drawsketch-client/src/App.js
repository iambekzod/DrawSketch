import React, {Component} from "react";
import "./style/App.css";
import Routes from "./Routes";
import { Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { inject, observer } from 'mobx-react';

const io = require('socket.io-client');
// https://github.com/benawad/react-native-login
// https://serverless-stack.com/chapters/create-a-login-page.html

//https://github.com/gothinkster/react-mobx-realworld-example-app/tree/master/src

class App extends Component {
  componentWillMount() {
    if (!this.props.commonStore.token) {
      this.props.commonStore.setAppLoaded();
    }
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.logout()
      .then(() => this.props.history.replace('/'));
  };

  componentDidMount() {
    if (this.props.commonStore.token) {
      this.props.userStore.pullUser()
        .finally(() => this.props.commonStore.setAppLoaded());
    }
  }

  render() {
    const user = this.props.commonStore.token;
    let handleSignOut = (user) ? <NavItem><NavLink href="#" onClick={this.handleSubmitForm} >Sign Out</NavLink></NavItem> : null;

    return (
      <div >
        <Navbar color="faded" light expand="md">
          <NavbarBrand className="header" href="/">DrawSketch</NavbarBrand>
            <Nav className="ml-auto" pills>
              <NavItem>
                <NavLink href="/credits">Credits</NavLink>
              </NavItem>
              {handleSignOut}
            </Nav>
        </Navbar>
        <Routes/>
      </div>
    );
  }
}

export default App = inject('userStore', 'authStore', 'commonStore')(observer(App))