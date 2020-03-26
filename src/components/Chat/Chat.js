import React, {Component} from "react";
import Loader from "react-loader";
import Messages from "../Messages";
import ChatixSDK from "../ChatixSDK";
import SendMessage from "../SendMessage";

import "./Chat.scss";

export default class Chat extends Component {
    chatixSDK = React.createRef();

    state = {
        loaded: false,
        name: 'Без названия',
        messages: null,
        members: [],
        users: {},
        me: null,
    };

    setMe = me => this.setState({ me });

    setTitle = name => this.setState({name, loaded: true});

    setMembers = members => {
        this.setState(({users}) => {
            const newUsers = {...users};

            members.map(member => newUsers[member.uuid] = member);

            return {
                members,
                users
            };
        })
    };

    setMessages = async messages => {
        const state = { messages };
        const users = {...this.state.users};

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];

            if (!users[message.sender_id] && message.sender_flag === 0) {
                const user = await this.chatixSDK.current.getUser(message.sender_id);
                users[user.uuid] = user;
            }
        }

        state.users = users;
        this.setState(state);
    };

    onSendMessage = async message => {
        const newMessage = await this.chatixSDK.current.sendChatroomMessage(message);

        this.addMessage(newMessage);
    };

    onNewMessageReceived = message => this.addMessage(message);

    addMessage(message) {
        this.setState(({messages}) => {
            const newArray = [...messages];
            newArray.push(message);

            return {
                messages: newArray
            };
        });
    }

    addMember = member => {
        this.setState(({users, members}) => {
            const newUsers = {...users};
            const newMembers = [...members];

            if (!newUsers[member.uuid]) {
                newUsers[member.uuid] = member;
            }

            newMembers.push(member);

            return {
                users: newUsers,
                members: newMembers
            }
        });
    };

    removeMember = id => {
        this.setState(({members}) => {
            const newMembers = members.filter(member => member.uuid !== id);
            this.setState({members: newMembers});
        });
    };

    updateMember = member => {
        this.setState(({members}) => {
            const idx = members.findIndex(el => el.id === member.uuid);
            const newMembers = [
                ...members.slice(0, idx),
                member,
                ...members.slice(idx + 1)
            ];

            return {
                members: newMembers
            };
        });
    };

    render() {
        const {name, messages, members, me, loaded} = this.state;

        return (
            <div className="chat-wrapper shadow">
                <Loader loaded={loaded}>
                    <div className="chat">
                        <div className="chat__title">
                            {name}
                        </div>
                        <Messages
                            members={members}
                            messages={messages}
                            me={me}
                        />
                        <SendMessage onSend={this.onSendMessage}/>
                    </div>
                </Loader>

                <ChatixSDK
                    ref={this.chatixSDK}
                    setMe={this.setMe}
                    setTitle={this.setTitle}
                    setMembers={this.setMembers}
                    addMember={this.addMember}
                    updateMember={this.updateMember}
                    removeMember={this.removeMember}
                    setMessages={this.setMessages}
                    onNewMessageReceived={this.onNewMessageReceived}
                />
            </div>
        );
    }
}