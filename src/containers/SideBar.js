import React from 'react'
import {observer} from "mobx-react"
import {CustomDropDown} from "./CustomDropDown"
import {ListGroupItem} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import "../style/form.css";
import "../style/sidebar.css";

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
    paint() {
        this.props.store.setCurColor("black");
        this.props.store.setWidth(2);
    }
    render() {
        return (
            <div className="list-group-flush side-bar draw-options">
                <ListGroupItem
                    action
                    className="draw-option"
                    onClick={this.paint}>
                    <i className="fa fa-pencil"></i>
                </ListGroupItem>
                <CustomDropDown store={this.props.store} iconType="slider">
                    <i className="fa fa-bullseye"></i>  
                </CustomDropDown>
                <CustomDropDown store={this.props.store} iconType="color">
                    <i className="fa fa-paint-brush"></i>
                </CustomDropDown>   
                <ListGroupItem
                    action
                    className="draw-option"
                    onClick={this.erase}>
                    <i className="fa fa-eraser"></i>
                </ListGroupItem>
            </div>
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
            .setWidth(50);
    }
})