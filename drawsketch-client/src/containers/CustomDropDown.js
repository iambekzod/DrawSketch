import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import {
    ListGroupItem,
    Row,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from 'reactstrap';
import "../style/dropdown.css";
const itemStyle = {
    border: "0 none"

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
        let menu = null
        if (this.props.iconType === "color") {
            menu = <div>
                <div>
                    <Row>
                        <button
                            style={{
                            backgroundColor: "red"
                        }}
                            className="colorSelect"></button>
                        <button
                            style={{
                            backgroundColor: "blue"
                        }}
                            className="colorSelect"></button>
                        <button
                            style={{
                            backgroundColor: "yellow"
                        }}
                            className="colorSelect"></button>
                        <button
                            style={{
                            backgroundColor: "green"
                        }}
                            className="colorSelect"></button>
                    </Row>
                </div>
                <div>
                    <input
                        style={{
                        marginLeft: "20px"
                    }}type="color"/>
                </div>
            </div>
        } else if (this.props.iconType === "pen") {
            menu = <div><input type="range" min="1" max="100" className="slider"/></div>
        }
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
                        {menu}
                    </DropdownMenu>
                </Dropdown>
            </div>
        )
    }
}