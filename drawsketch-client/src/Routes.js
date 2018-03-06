import React from "react";
import {Route, Switch} from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/LoginForm";
import Register from "./containers/RegisterForm";
import NotFound from "./containers/NotFound";
import {observableTodoStore, TodoList} from "./containers/Game"

export default() => <Switch>
  <Route path="/" exact component={Home}/>
  <Route path="/login" exact component={Login}/>
  <Route path="/register" exact component={Register}/>
  <Route
    path="/game"
    component=
    {() => <TodoList store = {observableTodoStore}/>}/>
  <Route component={NotFound}/>
</Switch>;