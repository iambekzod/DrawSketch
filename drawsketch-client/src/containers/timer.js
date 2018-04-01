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
        console.log(this.props.game.roundsPlayed);
        this.setState({elapsed: this.props.game.timeElapsed})
        this.tick();
    }
    tick = () => {
        this
            .props
            .socket
            .on('tick', (time) => {
                this.setState({elapsed: time})
            })
    }

    render() {

        return (
            <div style={{
                textAlign: "center"
            }}>
                {this.state.elapsed != '00:00'
                    ? (
                        <h1
                            style={{
                            color: "green"
                        }}>
                            {this.state.elapsed}</h1>
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
