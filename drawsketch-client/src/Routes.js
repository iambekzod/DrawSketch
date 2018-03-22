import React from "react";
import {Route, Switch} from "react-router-dom";
import Home from "./containers/Home";
import SignIn from "./containers/SignIn";
import SignUp from "./containers/SignUp";
import Credits from "./containers/Credits";
import Lobby from "./containers/Lobby";
import NotFound from "./containers/NotFound";
import {TodoList} from "./containers/Drawer"
import {observableTodoStore} from './stores/gameStore'

export default() => <Switch>
  <Route path="/" exact component={Home}/>
  <Route path="/signin" exact component={SignIn}/>
  <Route path="/credits" exact component={Credits}/>
  <Route path="/signup" exact component={SignUp}/>
  <Route path="/lobby" exact component={Lobby}/>
  <Route
    path="/game"
    component=
    {() => <TodoList store = {observableTodoStore}/>}/>
    
  <Route component={NotFound}/>
</Switch>;