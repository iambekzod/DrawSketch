import React from 'react';
import "../style/form.css";

export default class LoadingSpinner extends React.Component {

    render() {
        const inProgress = this.props.inProgress;

        if (inProgress) {
            return (
            <div className="loading-spinner" >
                <style>
                {`
                @keyframes loading-spinner {
                0% { transform : rotate(0deg); }
                100% { transform : rotate(360deg); }
                }
                `}
                </style>
            </div>
            );
        } else {
            return null;
        }
    }
}