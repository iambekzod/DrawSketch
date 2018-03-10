import React from "react";
import {Route, Switch} from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/LoginForm";
import Register from "./containers/RegisterForm";
import Credits from "./containers/Credits";
import NotFound from "./containers/NotFound";
import {TodoList} from "./containers/Game"
import {observableTodoStore} from './containers/GameStore'

export default() => <Switch>
  <Route path="/" exact component={Home}/>
  <Route path="/login" exact component={Login}/>
  <Route path="/credits" exact component={Credits}/>
  <Route path="/register" exact component={Register}/>
  <Route
    path="/game"
    component=
    {() => <TodoList store = {observableTodoStore}/>}/>
  <Route component={NotFound}/>
</Switch>;