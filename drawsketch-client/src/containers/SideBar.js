import React from 'react'
import {observer} from "mobx-react"
import "../style/form.css";
import {CustomDropDown} from "./CustomDropDown"
import {ListGroup} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
const sideBarStyle = {
    width: "6%",
    fontSize: "1.5em"
}

const paletteStyle = {
    maxWidth: "100%",
    maxHeight: "100%"
}

export const SideBar = observer(class TodoList extends React.Component {
    constructor(props) {
        super(props)
        this.erase = this
            .erase
            .bind(this);
    }
    render() {
        return (
            <ListGroup className="list-group-flush" style={sideBarStyle}>
                <CustomDropDown>
                    <i className="fa fa-pencil"></i>
                </CustomDropDown>
                <CustomDropDown>
                    <img
                        src="https://image.flaticon.com/icons/svg/61/61092.svg"
                        style={paletteStyle}></img>
                </CustomDropDown>
                <CustomDropDown>
                    <i className="fa fa-eraser"></i>
                </CustomDropDown>
            </ListGroup>
        );
    }
    erase() {
        console.log(this.props.store)
        this
            .props
            .store
            .setCurColor("white");
        this
            .props
            .store
            .setWidth(60);
        console.log(this.props.store.getColor)
    }
    paint() {}

})