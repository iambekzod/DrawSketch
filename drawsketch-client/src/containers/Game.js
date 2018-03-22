import React from 'react'
import {inject, observer, Provider} from "mobx-react"
import "../style/form.css";
import {
    Col,
    Row,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import {autorun} from "mobx";
import {SideBar} from './SideBar';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import io from 'socket.io-client';
import {Guesser} from './Guesser'
import {ObservableTodoStore} from '../stores/gameStore'
import TimerExample from './timer'
import LeftSideBar from './LeftSideBar';
import ChatBox from "./ChatBox";
import {Drawer} from "./Drawer";

// inspired by source code from lecture 2 HTML5
class Game extends React.Component {
    constructor(props) {
        super(props)
        this.socket = io.connect("https://localhost:3001");
        this.state = {
            begun: false
        };

    }
    componentDidMount() {
        var self = this;
        this
            .socket
            .on('connect', function () {
                self
                    .socket
                    .emit('authenticate', {token: self.props.userStore.token}) //send the jwt
                    .on('authenticated', function () {
                        self
                            .socket
                            .emit('join', 1);
                    })
                    .on("unauthorized", function (error, callback) {
                        console.log("unauthenticated");
                        if (error.data.type === "UnauthorizedError" || error.data.code === "invalid_token") {
                            // redirect user to login page perhaps?
                            callback();
                        }
                    });
            });
        this.roundStarted();
    }
    roundStarted = () => {
        this
            .socket
            .on('startRound', (game) => {
                this.setState({begun: true});
            })
    }
    render() {
        var timer = null
        if (this.state.begun) {
            timer = <Row>
                <Col>
                    <TimerExample start={Date.now()}/>
                </Col>
            </Row>
        }
        var userType = null;
        if (this.props.userType == 'draw') {
            userType = <Drawer socket={this.socket}/>
        }
        if (this.props.userType == 'guess') {
            userType = <Guesser socket={this.socket}/>
        }
        return (
            <div>
                {timer}
                <Provider store={this.props.store}>
                    <Row>
                        <LeftSideBar/>
                        <div
                            style={{
                            marginLeft: "40px"
                        }}>{userType}
                        </div>
                    </Row>

                </Provider>
            </div>
        )
    }
}

export default Game = inject('userStore')(observer(Game))