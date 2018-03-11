import React from 'react'
import {observer} from "mobx-react"
import "../style/form.css";
import {Col, Row} from 'reactstrap';
import {autorun} from "mobx";
import {SideBar} from './SideBar';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
const colors = {
    blue: "2C86DF",
    red: "#ff1a1a",
    yellow: "#ffff66"
}

export const TodoList = observer(class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.redraw = this
            .redraw
            .bind(this);
    }
    componentDidMount() {
        const canvas = this.refs.canvas
        autorun(() => console.log(this.props.store.Paint));
        const store = this.props.store;
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
        return (
            <div>
                <Row>
                    <SideBar store={this.props.store}/>
                    <canvas className="whiteboard" ref="canvas" width={656} height={400}/>
                </Row>
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
})
