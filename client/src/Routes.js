import React from "react";
import {Route, Switch} from "react-router-dom";
import Home from "./containers/Home";
import SignIn from "./containers/SignIn";
import SignUp from "./containers/SignUp";
import Credits from "./containers/Credits";
import Lobby from "./containers/Lobby";
import Game from "./containers/Game";
import Username from "./containers/Username";
import NotFound from "./containers/NotFound";

export default() => <Switch>
  <Route path="/" exact component={Home}/>
  <Route path="/signin" exact component={SignIn}/>
  <Route path="/credits" exact component={Credits}/>
  <Route path="/signup" exact component={SignUp}/>
  <Route path="/lobby" exact component={Lobby}/>
  <Route path="/username" exact component={Username}/>
  <Route
    path='/game/:id'
    component=
    {Game}/> 

  <Route component={NotFound}/>
</Switch>;