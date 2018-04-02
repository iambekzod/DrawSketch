import React from 'react'
import {observer, inject} from "mobx-react"
import {Alert, Col, Row} from 'reactstrap';
import ChatBox from './ChatBox';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import "../style/form.css";

// inspired by source code from lecture 2 HTML5
export const Guesser = inject("store")(observer(class Guesser extends React.Component {

    constructor(props) {
        super(props);
        this.redraw = this
            .redraw
            .bind(this);
        this.socket = this.props.socket;
        this.state = {
            begun: false,
            guess: ""
        };
    }
    componentDidMount() {
        this.setState({begun: this.props.game.started});
        this.updateCanvas();
        this.roundStarted();
        this.rightGuess();
        this.wrongGuess();
    }
    componentWillUnmount() {
        this.socket.disconnect();
    }
    render() {
        var guess = null
        var alert = null
        if (this.state.begun) {

            guess = <ChatBox sendMessage={this.makeGuess}/>
        }
        if (this.state.guess === "right") {
            alert = <Alert color="success">
                YOUR GUESS WAS CORRECT
            </Alert>
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
                            ref="gcanvas"
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
        this
            .socket
            .emit('guess', {
                id: this.props.game.id,
                user: this.props.user,
                guess: guess
            })
    }
    roundStarted = () => {
        this
            .socket
            .on('startRound', (game) => {
                this.setState({begun: true});
            })
    }
    wrongGuess = () => {
        this
            .socket
            .on('wrong', (guess) => {
                this.setState({guess: "wrong"});
            })
    }
    rightGuess = () => {
        this
            .socket
            .on('right', (guess) => {
                this.setState({guess: "right"});
                this
                    .socket
                    .emit('endRound', this.props.game.id);
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
        const canvas = this.refs.gcanvas
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
