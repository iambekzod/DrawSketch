import React from 'react'
import {observer, inject} from "mobx-react"
import {Alert,Col, Row, Input} from 'reactstrap';
import {SideBar} from './SideBar';
import Chatbox from './ChatBox';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import "../style/form.css";


import io from 'socket.io-client';

const colors = {
    blue: "2C86DF",
    red: "#ff1a1a",
    yellow: "#ffff66"
}
// inspired by source code from lecture 2 HTML5
export const Guesser = inject("store")(observer(class TodoList extends React.Component {

    constructor(props) {
        super(props);
        this.redraw = this
            .redraw
            .bind(this);
        this.socket = io('https://localhost:3001/');
        this.state = {
            begun: false,
            guess: ""
        };
    }
    componentDidMount() {
        var self = this;
        this.socket.on('connect', function () {
            self.socket.emit('authenticate', { token: self.props.token}) //send the jwt
                .on('authenticated', function () {
                    self.socket.emit('join', 1);
                })
                .on("unauthorized", function(error, callback) {
                    console.log("unauthenticated");
                    if (error.data.type === "UnauthorizedError" || error.data.code === "invalid_token") {
                        // redirect user to login page perhaps?
                        callback();
                    }
                });
        });
        const store = this.props.store
        this.updateCanvas();
        this.roundStarted();
        this.rightGuess();
        this.wrongGuess();
            // Connected, let's sign-up for to receive messages for this room
        this.socket.emit('join', 1);
    }
    render() {
        var guess = null
        var alert = null
        if (this.state.begun) {

            guess = <Chatbox sendMessage = {this.makeGuess}/>
        }
        if(this.state.guess == "right"){
            alert = <Alert color="success"> YOUR GUESS WAS CORRECT </Alert>
        }
        if(this.state.guess == "wrong"){
            alert = <Alert color="danger"> YOUR GUESS WAS WRONG </Alert>
        }

        return (
            <div
                style={{
                marginTop: "100px",
                marginLeft: "100px"
            }}>
                {alert}
                <Row>
                    <Col>
                        <canvas
                            style={{
                            border: "solid red 1"
                        }}
                            ref="canvas"
                            width={656}
                            height={400}className="whiteboard"/>
                    </Col>
                    <Col>
                        {guess}
                    </Col>
                </Row>
            </div>

        );
    }
    makeGuess = (guess) => {
        this.socket.emit('guess', guess)
    }
    roundStarted = () => {
        this
            .socket
            .on('startRound', (game) => {
                this.setState({begun: true});
            })
    }
    wrongGuess = () => {
        this.socket.on('wrong', (guess) => {
            this.setState({guess:"wrong"});
        })
    }
    rightGuess = () => {
        this.socket.on('right', (guess) => {
            this.setState({guess: "right"});
        })
    }
    updateCanvas = () => {
        this
            .socket
            .on('return', (state) => {
                this
                    .props
                    .store
                    .updateState(state);
                this.redraw();
            });
    }
    redraw() {
        const canvas = this.refs.canvas
        const store = this.props.store;
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        context.lineJoin = "round";

        for (var i = 0; i < store.getX.length; i++) {
            context.lineWidth = store.getPenWidth[i];
            if (store.dragging[i]) {
                context.beginPath();
                context.moveTo(store.getX[i - 1], store.getY[i - 1])
                context.lineTo(store.getX[i], store.getY[i]);
                context.closePath();
                context.strokeStyle = store.paintColor[i];
                context.stroke();
            }
        }
    }
}))
