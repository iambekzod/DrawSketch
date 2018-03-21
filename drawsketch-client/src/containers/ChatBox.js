import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import { Form, Input} from "reactstrap";
import "../style/sidebar.css";
import Message from "./Message";

class ChatBox extends Component {

    handleGuessChange = e => this.props.messageStore.setGuess(e.target.value);
    handleSubmitForm = (e) => {
      e.preventDefault();

      //alert(this.props.messageStore.values.guess);
      this.props.messageStore.addGuess();
      //this.props.messageStore.messages.push(this.props.messageStore.values.guess);
    };

    render() {
        const { values, messages } = this.props.messageStore;

        const renderMessages = messages.map((message, i) => {
            return (
              <Message
                key={i}
                username={message.username}
                message={message.message}
                fromMe={message.fromMe} />
            );
          });

        return (
        <div className="chat-box" >
            <div className="messages">
                {renderMessages}
            </div>
            <div className="send-messages">
                <Form onSubmit={this.handleSubmitForm}>
                <Input type="text" 
                    id="message"
                    placeholder="Enter your guess"
                    value={values.guess}
                    onChange={this.handleGuessChange}
                    required/>
                </Form>
            </div>
        </div>
        );
    }
}

export default ChatBox = inject('userStore', 'messageStore')(observer(ChatBox))