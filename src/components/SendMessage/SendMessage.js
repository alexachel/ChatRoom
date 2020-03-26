import React, {Component} from "react";

import "./SendMessage.scss";



class SendMessage extends Component {
    state = {
        message: ''
    };

    onChangeMessage = e => {
        this.setState({message: e.target.value });
    };

    sendMessage = e => {
        e.preventDefault();

        const {message} = this.state;

        if (message.length) {
            this.props.onSend(message);
            this.setState({message: ''});
        }
    };

    render() {
        const {sendMessage, state, onChangeMessage} = this;
        const {message} = state;

        return (
            <form className="send-message" onSubmit={sendMessage}>
                <input
                    className="form-control"
                    placeholder="Сообщение"
                    type="text"
                    value={message}
                    onChange={onChangeMessage}
                />
                <button className="btn btn-primary">Отправить</button>
            </form>
        );
    }
}

export default SendMessage;