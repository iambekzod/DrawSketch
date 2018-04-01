import React from 'react'
import {Alert} from 'reactstrap';
export default class TimerExample extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            elapsed: 0,
            rounds: 1
        }
    }
    componentDidMount() {
        console.log(this.props.game.roundsPlayed);
        this.setState({
            rounds: this.state.rounds + this.props.game.roundsPlayed,
            elapsed: this.props.game.timeElapsed
        })
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

    newRound = () => {
        this
            .props
            .socket
            .on('startRound', (game) => {
                this.setState({
                    rounds: this.state.rounds + 1
                })
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
                        }}>ROUND {this.state.rounds + ":  "}
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
