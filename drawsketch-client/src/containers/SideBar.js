import React from 'react'
import {observer} from "mobx-react"
import "../style/form.css";
import {CustomDropDown} from "./CustomDropDown"
import {ListGroup, ListGroupItem} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
const sideBarStyle = {
    width: "6%",
    fontSize: "1.5em"
}

const paletteStyle = {
    width: "25px",
    height: "25px"
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
    render() {
        return (
            <ListGroup className="list-group-flush" style={sideBarStyle}>
                <CustomDropDown store={this.props.store}/>
                <ListGroupItem
                    action
                    style={{
                    border: "0 none",
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center"
                }}
                    onClick={this.paint}>
                    <CustomDropDown store={this.props.store} iconType="pen">
                        <i className="fa fa-pencil"></i>
                    </CustomDropDown>
                </ListGroupItem>
                <CustomDropDown store={this.props.store} iconType="color">
                    <ListGroupItem
                        action
                        style={{
                        border: "0 none",
                        display: "flex"
                    }}>
                        <img
                            src="https://image.flaticon.com/icons/svg/61/61092.svg"
                            alt="palette"
                            style={paletteStyle}></img>
                    </ListGroupItem>
                </CustomDropDown>
                <ListGroupItem
                    action
                    style={{
                    border: "0 none",
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center"
                }}
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
    paint() {
        this
            .props
            .store
            .setCurColor("black");
        this
            .props
            .store
            .setWidth(2);
    }
})