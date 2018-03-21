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
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'


const itemStyle = {
    border: "0 none"

}

const listGroupStyle = {
    border: "1",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    height: "50px"
}

export const CustomDropDown = class CustomDropDown extends Component {
    constructor(props) {
        super(props)
        this.toggle = this
            .toggle
            .bind(this);
        this.state = {
            dropdownOpen: false,
            value: 2
        };
    }
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    paint(color) {
        this
            .props
            .store
            .setCurColor(color);
        this
            .props
            .store
            .setWidth(2);
    }
    handleChange = value => {
        this.setState({
          value: value
        });
        this
            .props
            .store
            .setWidth(value);
    };
    changeColor = hex => {
        this.props.store.setCurColor(hex.target.value);
        this
            .props
            .store
            .setWidth(2);
    }
    render() {
        let { value } = this.state;
        let menu = null
        if (this.props.iconType === "color") {
            menu = <div>
                <div>
                    <Row>
                        <button
                            style={{
                            backgroundColor: "red"
                        }}
                            className="colorSelect"
                            onClick={this.paint.bind(this, "red")}></button>
                        <button
                            style={{
                            backgroundColor: "blue"
                        }}
                            className="colorSelect"
                            onClick={this.paint.bind(this, "blue")}></button>
                        <button
                            style={{
                            backgroundColor: "yellow"
                        }}
                            className="colorSelect"
                            onClick={this.paint.bind(this, "yellow")}></button>
                        <button
                            style={{
                            backgroundColor: "green"
                        }}
                            className="colorSelect"
                            onClick={this.paint.bind(this, "green")}></button>
                    </Row>
                </div>
                <div>
                    <input
                        style={{
                        marginLeft: "20px"
                    }}type="color"
                    onChange={this.changeColor}/>
                </div>
            </div>
        } else if (this.props.iconType === "slider") {
            menu = <div className='slider'>
                        <Slider
                          min={0}
                          max={15}
                          step = {1}
                          value={value}
                          onChange={this.handleChange}/>
                    </div>
        }

        console.log(menu)
        return (
            <ListGroupItem 
            action
            style={listGroupStyle}
            onClick= {() => {
                this.setState({
                    btnDropright: !this.state.btnDropright
                });
            }}>
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
                        data-toggle="dropdown"
                        aria-expanded={this.state.dropdownOpen}>

                        {this.props.children}
                    </DropdownToggle>
                    <DropdownMenu
                        style={{
                        marginLeft: "1rem"
                    }}>
                            {menu}
                    </DropdownMenu>
                </Dropdown>
            </div>
                </ListGroupItem>
        )
    }
}