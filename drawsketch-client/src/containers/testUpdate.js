import React from 'react'
import {observer, inject} from "mobx-react"
import {Col, Row} from 'reactstrap';
import {SideBar} from './SideBar';

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
    }
    componentDidMount() {
        const store = this.props.store
        this.updateCanvas();
    }
    render() {
        return (
            <div>
                <canvas
                    style={{
                    border: "solid red 1",
                    marginTop: "100px",
                    marginLeft: "100px"
                }}
                    ref="canvas"
                    width={656}
                    height={400}className="whiteboard"/>
            </div>

        );
    }
    updateCanvas = () => {
        const socket = io('https://localhost:3001/');
        socket.on('return', (state) => {
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
