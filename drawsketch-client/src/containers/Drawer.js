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
import "../style/sidebar.css";
import io from 'socket.io-client';
import {Guesser} from './Guesser'
import {ObservableTodoStore} from '../stores/gameStore'
import LeftSideBar from './LeftSideBar';
import ChatBox from "./ChatBox";

// inspired by source code from lecture 2 HTML5
export const Drawer = (inject('store'))(observer(class Drawer extends React.Component {

    constructor(props) {
        super(props);
        var self = this;
        this.socket = this.props.socket;
        this.redraw = this
            .redraw
            .bind(this);
        this.beginGame = this
            .beginGame
            .bind(this);
        this.state = {
            begun: false,
            word: "",
            modal: false
        };
        this.toggle = this
            .toggle
            .bind(this);
    }
    componentDidMount() {
        const store = this.props.store;
        const canvas = this.refs.canvas;
        var self = this;
        canvas.addEventListener('mousedown', function (e) {
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            store.setPaint(true);
            store.addClick(mouseX, mouseY, false);
            self.redraw();

        });

        // this.socket.emit()

        canvas.addEventListener('mousemove', (function (e) {
            if (store.Paint) {
                // console.log(store.getX);
                store.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                self.redraw();
            }
        }));
        canvas.addEventListener('mouseup', (e) => store.setPaint(false))
        canvas.addEventListener('mouseleave', () => store.setPaint(false))
    }
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    makeGuess = (guess) => {
        this
            .socket
            .emit('guess', guess)
    }
    render() {
        var beginButton = <div className="begin-btn">
            <Button outline onClick={this.beginGame} color="primary">
                Begin Game
            </Button>
        </div>
        if (this.state.begun) {
            beginButton = null;
        }
        const newStore = new ObservableTodoStore();
        return (

            <div>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Draw this</ModalHeader>
                    <ModalBody>
                        Your Word is {this.state.word}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>OK</Button>
                    </ModalFooter>
                </Modal>

                <Row>
                    <canvas className="whiteboard" ref="canvas" width={656} height={400}/>
                    <ChatBox sendMessage={this.makeGuess}/>
                </Row>

                <Row>
                    <Col>
                        <SideBar store={this.props.store}/>
                    </Col>
                    <Col>
                        {beginButton}
                    </Col>
                </Row>

            </div>

        );
    }

    beginGame() {
        var sef = this;
        this
            .socket
            .emit('beginRound', JSON.stringify({id: "playerA"}))
            .on('getWord', (word) => {
                this.setState({begun: true, modal: true, word: word})
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
        this
            .socket
            .emit('gameState', JSON.stringify({id: 1, game: gameState}));
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
}))
