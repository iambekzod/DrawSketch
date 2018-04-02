import React, { Component } from 'react'
import "../style/form.css";
import "../style/sidebar.css";
import {ListGroup} from 'reactstrap';
import UserList from "./UserList"

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

export default class LeftSideBar extends Component {
    render() {
        return (
            <ListGroup className="list-group-flush side-bar">
                <UserList game={this.props.game} socket={this.props.socket} />
            </ListGroup>
        );
    }
}
