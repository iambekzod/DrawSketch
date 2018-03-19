import React from 'react'
import {observer, Provider} from "mobx-react"
import "../style/form.css";
import {Col, Row} from 'reactstrap';
import {autorun} from "mobx";
import {SideBar} from './SideBar';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import io from 'socket.io-client';
import {Guesser} from './testUpdate'
import {observableTodoStore, ObservableTodoStore} from '../stores/gameStore'
import ChatBox from "./ChatBox";

const colors = {
    blue: "2C86DF",
    red: "#ff1a1a",
    yellow: "#ffff66"
}
// inspired by source code from lecture 2 HTML5
export const TodoList = observer(class TodoList extends React.Component {

    constructor(props) {
        super(props);
        this.redraw = this
            .redraw
            .bind(this);
    }
    componentDidMount() {
        const socket = io('https://localhost:3001/');
        const store = this.props.store
        setInterval(() => {
            const gameState = {
                xPos: store.getX,
                yPos: store.getY,
                color: store.getColor,
                width: store.getPenWidth,
                curWidth: store.getWidth,
                curColor: store.getCurColor,
                isPainting: store.Paint,
                dragging: store.getDrag
            }
            socket.emit('gameState', JSON.stringify(gameState));
        }, 500)
        const canvas = this.refs.canvas
        autorun(() => console.log(this.props.store.Paint));
        var self = this;
        canvas.addEventListener('mousedown', function (e) {
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            store.setPaint(true);
            store.addClick(mouseX, mouseY, false);
            self.redraw();

        });

        canvas.addEventListener('mousemove', (function (e) {
            if (store.Paint) {
                console.log(store.getX);
                store.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                self.redraw();
            }
        }));
        canvas.addEventListener('mouseup', (e) => store.setPaint(false))
        canvas.addEventListener('mouseleave', () => store.setPaint(false))
    }
    render() {
        const newStore = new ObservableTodoStore();
        return (
            <div>
                <Row>
                    <SideBar store={this.props.store}/>
                    <canvas className="whiteboard" ref="canvas" width={656} height={400}/>
                    <ChatBox/>
                </Row>
                <Provider store={newStore}>
                    <div>
                        <Guesser redraw ={this.testReDraw}/>
                    </div>
                </Provider>
            </div>

        );
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
    testReDraw(ref) {
        const canvas = ref
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
})
