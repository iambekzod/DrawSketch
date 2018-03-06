import {action, extendObservable} from 'mobx'
class ObservableTodoStore {
    constructor() {
        extendObservable(this, {
            isPainting: false,
            xPos: [],
            yPos: [],
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
                return this.paintColor;
            },
            get getWidth() {
                return this.brushWidth;
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
                this
                    .paintColor
                    .push(this.getCurColor);

            }),
            setCurColor: action((set) => this.curColor = set),
            setPaint: action((set) => this.isPainting = set),
            setWidth: action((width) => this.width = width),
            setColor: action((color) => this.paintColor.push(color))
        })
    }
}

export const observableTodoStore = new ObservableTodoStore();