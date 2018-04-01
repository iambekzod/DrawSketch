/* timer taken from https://codepen.io/smonn/pen/KzezEw */
import React from 'react'
import {Alert} from 'reactstrap';
export default class TimerExample extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            elapsed: 0
        }
    }
    componentDidMount() {

        // componentDidMount is called by react when the component has been rendered on
        // the page. We can set the interval here:
        console.log("REMOUNTED");

        this.timer = setInterval(this.tick, 50);
    }

    componentWillUnmount() {

        // This method is called immediately before the component is removed from the
        // page and destroyed. We can clear the interval here:

        clearInterval(this.timer);
    }

    tick = () => {

        // This function is called every 50 ms. It updates the elapsed counter. Calling
        // setState causes the component to be re-rendered

        this.setState({
            elapsed: new Date() - this.props.start
        });
    }

    render() {

        // Calculate elapsed to tenth of a second:
        var elapsed = Math.round(this.state.elapsed / 100);

        // This will give a number with one digit after the decimal dot (xx.x):
        var seconds = 60 - Math.floor((elapsed / 10).toFixed(1));

        // Although we return an entire <span> element, react will smartly update only
        // the changed parts, which contain the seconds variable.

        return (
            <div style={{
                textAlign: "center"
            }}>
                {seconds > 0
                    ? (
                        <h1
                            style={{
                            color: "green"
                        }}>{seconds}</h1>
                    )
                    : (
                        <Alert color="primary">
                            Times Up ! Round Over
                        </Alert>
                    )}
            </div>
        )
    }
};
