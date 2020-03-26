import React, {Component} from "react";
import ChatixCore from 'chatix-core';


class ChatixSDK extends Component {
    constructor(props) {
        super(props);

        const websiteId = "dc552580-e2e3-4767-bd76-c67273481423";
        const {setTitle, setMembers, setMessages, setMe} = props;

        this.chatId = "d8d2864c-c260-4abd-bc69-543fdb998264";
        this.sdk = new ChatixCore(websiteId);

        this.sdk.start()
            .then( async () => {
                try {
                    if (setMe) {
                        const me = this.sdk.getVisitor();
                        setMe(me);
                    }

                    const myChatrooms = await this.sdk.getMyChatrooms();
                    if (myChatrooms.filter(x => x.id === this.chatId).length === 0) {
                        await this.sdk.connectToChatroom(this.chatId);
                    }

                    const chat = await this.sdk.getChatroom(this.chatId);
                    if (setTitle) {
                        setTitle(chat.title);
                    }

                    let membersPage = 1;
                    let allChatroomMembers = [];
                    while(true) {
                        let pagedMembers = await this.sdk.getChatroomMembers(this.chatId, membersPage++, 10);
                        allChatroomMembers = [...allChatroomMembers, ...pagedMembers];
                        if (pagedMembers.length === 0) {
                            break;
                        }
                    }
                    if (setMembers) {
                        setMembers(allChatroomMembers);
                    }

                    const lastMessages = await this.sdk.getChatroomMessages(this.chatId, null, 100);
                    if (setMessages) {
                        setMessages(lastMessages);
                    }
                } catch (err) {
                    console.error(err);
                }
            })
            .catch((e) => {
                console.error(e);
            });

        this.sdk.onChatroomMessageReceived = (chatroomId, message) => {
            if (chatroomId === this.chatId) {
                this.props.onNewMessageReceived(message);
            }
        };

        this.sdk.onMemberConnectedToChatroom = (chatroomId, member) => {
            if (chatroomId === this.chatId && props.addMember) {
                this.props.addMember(member);
            }
        };

        this.sdk.onMemberDisconnectedFromChatroom = (chatroomId, member) => {
            if (chatroomId === this.chatId && props.removeMember) {
                this.props.removeMember(member);
            }
        };

        this.sdk.onApplyVisitorInfo = (visitor) => {
            this.props.updateMember(visitor)
        }
    }

    sendChatroomMessage = (text) => {
        try {
            return this.sdk.sendChatroomTextMessage(text, this.chatId);
        } catch (e) {
            console.error(e);
        }
    };

    updateVisitor(visitor){
        this.sdk.setVisitor(visitor)
    }

    async getUser(userId){
        return await this.sdk.getMember(userId);
    }

    render() {
        return null;
    }
}

export default ChatixSDK;