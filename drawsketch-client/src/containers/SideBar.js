import React from 'react'
import {observer} from "mobx-react"
import "../style/form.css";
import {CustomDropDown} from "./CustomDropDown"
import {ListGroup, ListGroupItem} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
const sideBarStyle = {
    width: "12%",
    fontSize: "1.5em"
}

const paletteStyle = {
    width: "25px",
    height: "25px"
}

const listGroupStyle = {
    border: "1",
    display: "flex",
    justifyContent: "center",
    alignContent: "center"
}

export const SideBar = observer(class TodoList extends React.Component {
    constructor(props) {
        super(props)
        this.erase = this
            .erase
            .bind(this);
        this.paint = this
            .paint
            .bind(this);
    }
    paint(){
        this.props.store.setCurColor("black");
        this.props.store.setWidth(2);
    }
    render() {
        return (
            <ListGroup className="list-group-flush" style={sideBarStyle}>
                <ListGroupItem
                    action
                    style={listGroupStyle}
                    onClick={this.paint}>
                    <i className="fa fa-pencil"></i>
                </ListGroupItem>
                
                <ListGroupItem
                    action
                    style={listGroupStyle}
                    >
                    <CustomDropDown store={this.props.store} iconType="slider">
                        <i className="fa fa-bullseye"></i>
                    </CustomDropDown>
                </ListGroupItem>
                <ListGroupItem
                    action
                    style={listGroupStyle}>
                    <CustomDropDown store={this.props.store} iconType="color">
                        <img
                            src="https://image.flaticon.com/icons/svg/61/61092.svg"
                            alt="palette"
                            style={paletteStyle}></img>
                    </CustomDropDown>
                </ListGroupItem>
                <ListGroupItem
                    action
                    style={listGroupStyle}
                    onClick={this.erase}>
                    <i className="fa fa-eraser"></i>
                </ListGroupItem>
            </ListGroup>
        );
    }
    erase() {
        this
            .props
            .store
            .setCurColor("white");
        this
            .props
            .store
            .setWidth(50)
    }
})