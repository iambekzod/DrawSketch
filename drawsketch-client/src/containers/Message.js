import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import "../style/sidebar.css";

class Message extends Component {

    render() {
        // Was the message sent by the current user. If so, add a css class
        const fromMe = this.props.fromMe ? 'from-me' : '';
        return (
          <div className='message'>
            <div className={`username ${fromMe}`}>
              { this.props.username + ': '}
            </div>
            <div className='message-body'>
              { this.props.message }
            </div>
          </div>
        );
    }
}

export default Message = inject('userStore', 'messageStore')(observer(Message))