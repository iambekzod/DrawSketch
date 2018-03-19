import React from 'react'
import {observer, inject} from "mobx-react"
import "../style/form.css";
import {Col, Row, Input} from 'reactstrap';
import {autorun} from "mobx";
import {SideBar} from './SideBar';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
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
            begun: false
        };
    }
    componentDidMount() {
        console.log(this.props.store);
        const store = this.props.store
        this.updateCanvas();
        this.roundStarted();
    }
    render() {
        var guess = null
        if (this.state.begun) {

            guess = <div
                style={{
                width: "300px",
                height: "500px",
                border: "solid black 1px ",
                padding: "10px"
            }}><Input placeholder="GUESS THE PICTURE"/>
            </div>
        }
        return (
            <div
                style={{
                marginTop: "100px",
                marginLeft: "100px"
            }}>
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

    roundStarted = () => {
        this
            .socket
            .on('startRound', (game) => {
                this.setState({begun: true});
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
        console.log("REDRAWING");
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
