import React from 'react'
import {observer} from "mobx-react"
import {autorun, action, extendObservable} from 'mobx'
import "../style/form.css";
import 'font-awesome/css/font-awesome.min.css';
import ReactDOM from 'react-dom';
const colors = {
    blue: "2C86DF",
    red: "#ff1a1a",
    yellow: "#ffff66"
}

class ObservableTodoStore {
    constructor() {
        extendObservable(this, {
            isPainting: false,
            xPos: [],
            yPos: [],
            dragging: [],
            paintColor: "black",
            brushWidth: 5,
            get Paint() {
                return this.isPainting;
            },
            get getX() {
                return this
                    .xPos
                    .map(e => e);
            },
            get getY() {
                return this
                    .yPos
                    .map(e => e);
            },
            get getDrag() {
                return this
                    .dragging
                    .map(e => e);
            },
            addClick: action(function (x, y, dragging) {
                this
                    .xPos
                    .push(x);
                this
                    .yPos
                    .push(y);
                this
                    .dragging
                    .push(dragging);

            }),
            setPaint: action((set) => this.isPainting = set),
            setWidth: action((color) => this.paintColor = color),
            setColor: action((width) => this.brushWidth = width)
        })
    }
}

export const observableTodoStore = new ObservableTodoStore();

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
            console.log(this)
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            console.log(mouseX, mouseY);
            store.setPaint(true);
            store.addClick(mouseX, mouseY, false);
            self.redraw();

        });

        canvas.addEventListener('mousemove', (function (e) {
            console.log(("HERE"))
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
                <canvas className="whiteboard" ref="canvas" width={656} height={400}/>
            </div>

        );
    }
    redraw() {
        const canvas = this.refs.canvas
        const store = this.props.store;
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

        context.strokeStyle = "black";
        context.lineJoin = "round";
        context.lineWidth = 5;

        for (var i = 0; i < store.getX.length; i++) {
            if (store.dragging[i]) {
                context.beginPath();
                context.moveTo(store.getX[i - 1], store.getY[i - 1])
                context.lineTo(store.getX[i], store.getY[i]);
                context.closePath();
                context.stroke();
            }
        }
    }
})

const SideBar = observer(class TodoList extends React.Component {
    render() {
        return (
            <div className="listGroup">
                <li className="list-group-item d-flex list-group-item-action">
                    Cras justo odio
                    <span className="badge badge-primary badge-pill">14</span>
                </li>
                <li className="list-group-item list-group-item-action">
                    Dapibus ac facilisis in
                    <span className="badge badge-primary badge-pill">2</span>
                </li>
                <i class="far fa-edit"></i>
            </div>
        );
    }

})