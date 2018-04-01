import {action, extendObservable} from 'mobx'

class GameStore {
    constructor() {
        extendObservable(this, {
            isPainting: false,
            xPos: [],
            yPos: [],
            penWidth: [],
            dragging: [],
            paintColor: [],
            brushWidth: 2,
            curColor: "black",
            get Paint() {
                return this.isPainting;
            },
            get getCurColor() {
                return this.curColor;
            },
            get getX() {
                return this
                    .xPos
                    .map(e => e);
            },
            get getColor() {
                return this
                    .paintColor
                    .map(e => e);
            },
            get getWidth() {
                return this.brushWidth;
            },

            get getY() {
                return this
                    .yPos
                    .map(e => e);
            },
            get getPenWidth() {
                return this
                    .penWidth
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
                    .penWidth
                    .push(this.getWidth);
                this
                    .dragging
                    .push(dragging);
                this
                    .paintColor
                    .push(this.getCurColor);

            }),
            setCurColor: action((set) => this.curColor = set),
            setPaint: action((set) => this.isPainting = set),
            setWidth: action((width) => this.brushWidth = width),
            setColor: action((color) => this.paintColor.push(color)),
            reset: action(() => {
                this.xPos = [];
                this.yPos = [];
                this.dragging = [];
                this.penWidth = [];
                this.paintColor = [];
                this.brushWidth = 2;
                this.curColor = "black";
                this.isPainting = false;
            }),
            updateState: action((returned) => {
                /*
                                xPos: store.getX,
                yPos: store.getY,
                color: store.getColor,
                width: store.getPenWidth,
                curWidth: store.getWidth,
                curColor: store.getCurColor,
                isPainting: store.Paint,
                dragging: store.getDrag
                */
                let state = JSON.parse(returned);
                // console.log(state.dragging);
                if (state.xPos.length !== 0) {
                    this.xPos = state.xPos;
                    this.yPos = state.yPos;
                    this.dragging = state.dragging;
                    this.penWidth = state.width;
                    this.paintColor = state.color;
                    this.brushWidth = state.curWidth;
                    this.curColor = state.curColor;
                    this.isPainting = state.isPainting;
                } else {
                    this.reset();
                }

            })
        })
    }
}

export default new GameStore();