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
        this.socket = io.connect("http://localhost:8080");
        this.state = {
            begun: false,
            newRound: false,
            userType: "",
            game: ""
        };

    }
    componentDidMount() {
        this
        .socket
        .on('connect', () => {
            this
                .socket
                .emit('authenticate', {token: this.props.userStore.token}) //send the jwt
                .on('authenticated', () => {
                    Promise.all([this.props.userStore.pullUser(), this.props.lobbyStore.getRoom(this.props.match.params.id)]).then((values) => {
                        if(values[1].players.find((e) => e.username == values[0].username).length == 0){
                            alert("UNAUTHORIZED");
                            return;
                        }
                        this.setState({game: values[1]});
                        if(values[0].username == values[1].drawer.username){
                            this.setState({userType:"draw"});
                        }
                        else{
                            this.setState({userType:"guess"});
                        }
                        this.props.gameStore.updateState(JSON.stringify(values[1].gameState));
                        this.props.gameStore.setPaint(false);
                        this.roundStarted();
                        this.roundEnded();
                        this
                        .socket
                        .emit('join', values);
                    })
                })
                .on("unauthorized", function (error, callback) {
                    console.log("unauthenticated");
                    if (error.data.type === "UnauthorizedError" || error.data.code === "invalid_token") {
                        // redirect user to login page perhaps?
                        callback();
                    }
                });
        });
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
            userType = <Drawer game = {this.state.game} socket={this.socket}/>
        }
        if (this.state.userType === 'guess') {
            userType = <Guesser game = {this.state.game} socket={this.socket}/>
        }
        return (
            <div>
                {roundAlert}
                {timer}
                <Provider store={this.props.gameStore}>
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

export default Game = inject('userStore', 'lobbyStore', 'gameStore')(observer(Game))