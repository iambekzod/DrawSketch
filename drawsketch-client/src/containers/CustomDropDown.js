import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import {ListGroupItem, Dropdown, DropdownMenu, DropdownItem, DropdownToggle} from 'reactstrap';
import "../style/dropdown.css";
const itemStyle = {
    borderTop: "0 none"

}

export const CustomDropDown = class CustomDropDown extends Component {
    constructor(props) {
        super(props)
        this.toggle = this
            .toggle
            .bind(this);
        this.state = {
            dropdownOpen: false
        };
    }
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    render() {
        return (
            <div className="container">
                <Dropdown
                    direction="right"
                    isOpen={this.state.btnDropright}
                    toggle={() => {
                    this.setState({
                        btnDropright: !this.state.btnDropright
                    });
                }}>
                    <DropdownToggle
                        tag="span"
                        onClick={this.toggle}
                        data-toggle="dropdown"
                        aria-expanded={this.state.dropdownOpen}>
                        <ListGroupItem onClick={this.erase} style={itemStyle} action>
                            {this.props.children}
                        </ListGroupItem >
                    </DropdownToggle>
                    <DropdownMenu
                        style={{
                        marginLeft: "1rem"
                    }}>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        )
    }
}