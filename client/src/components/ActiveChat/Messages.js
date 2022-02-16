import React, {useEffect, useState}from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { connect } from "react-redux";
import { readMessage } from "../../store/utils/thunkCreators";
import { BadgeAvatar } from "../Sidebar";
import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  avatarBox: {
    display: 'flex', alignItems: 'flex-end', flexDirection: 'column'
  }
}))

const Messages = (props) => {
  const classes = useStyles()
  const { messages, otherUser, userId, conversation, readMessage, activeChat } = props;
  const [readMessages, setReadMessages] = useState(messages.filter((mes) => mes.read === true && mes.senderId === userId));
  const lastReadMessage = readMessages[readMessages.length - 1];

  useEffect(() => {
    if (conversation.unreadMessages?.length > 0) {
      setReadMessages(messages.filter((mes) => mes.senderId === userId))
      conversation.unreadMessages.map((convo) => {
        readMessage({ id: convo.id , conversationId: conversation.id })
      })
    }
  }, [conversation.unreadMessages, activeChat])

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <Box key={message.id} className={classes.avatarBox}>
            <SenderBubble text={message.text} time={time} />
            {
              lastReadMessage?.id === message.id &&
              <BadgeAvatar
                photoUrl={otherUser.photoUrl}
                username={otherUser.username}
                online={otherUser.online}
                chatReadAvatar={true}
                sideBar={false}
                invisible={true}
              />
            }
          </Box>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    readMessage: (body) => {
      dispatch(readMessage(body));
    },
  };
};

export default connect(null, mapDispatchToProps)(Messages);
