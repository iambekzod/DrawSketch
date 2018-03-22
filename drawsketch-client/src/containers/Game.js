import React from 'react'
import {inject, observer, Provider} from "mobx-react"
import "../style/form.css";
import {
    Col,
    Row,
    Alert
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import io from 'socket.io-client';

import TimerExample from './timer'
import LeftSideBar from './LeftSideBar';
import {Drawer} from "./Drawer";
import {Guesser} from './Guesser'

// inspired by source code from lecture 2 HTML5
class Game extends React.Component {
    constructor(props) {
        super(props)
        this.socket = io.connect("https://localhost:3001");
        this.state = {
            begun: false,
            newRound: false,
            userType: this.props.userType
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
        this.roundEnded();
    }
    roundStarted = () => {
        this
            .socket
            .on('startRound', (game) => {
                this.setState({begun: true, newRound: false});
            })
    }

    roundEnded = () => {
        this
            .socket
            .on('roundEnd', (game) => {
                this.setState({begun: false, newRound: true});
                setTimeout(() => {
                    let type = (this.state.userType === 'draw') ? 'guess' : 'draw';
                    this.setState({userType: type});
                })
            })
    }
    render() {
        var timer = null
        var roundAlert = null;
        if (this.state.begun) {
            timer = <Row>
                <Col>
                    <TimerExample start={Date.now()}/>
                </Col>
            </Row>
        }
        if (this.state.newRound) {
            roundAlert = <Alert color="warning">
                NEW ROUND STARTING SOON
            </Alert>
        }
        var userType = null;
        if (this.state.userType === 'draw') {
            userType = <Drawer socket={this.socket}/>
        }
        if (this.state.userType === 'guess') {
            userType = <Guesser socket={this.socket}/>
        }
        return (
            <div>
                {roundAlert}
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