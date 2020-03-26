import React, {useEffect} from "react";
import Loader from "react-loader";

import "./Messages.scss";

function getName(member, message, isMe) {
    if (isMe) {
        return 'Я'
    }

    return member && member.name ||
        `User_${message.sender_id.substring(message.sender_id.length - 5, message.sender_id.length)}`
}

function Messages(props) {
    const {messages, members, me} = props;
    const messagesContainer = React.createRef();

    useEffect(() => {
        messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
    }, [props, messagesContainer]);

    return <div className="messages" ref={messagesContainer}>
            <Loader loaded={!!messages}>
            {
                messages && messages.map(message => {
                    const member = members.find(user => user.uuid === message.sender_id);
                    const isMe = message.sender_id === me.uuid;

                    return <div className={`message ${isMe ? 'me' : ''}`} key={message.uuid}>
                        <div className="message__sender">
                            {getName(member, message, isMe)}
                        </div>
                        <div className="message__text">
                            {message.content}
                        </div>
                    </div>
                })
            }
            </Loader>
        </div>
}

export default Messages