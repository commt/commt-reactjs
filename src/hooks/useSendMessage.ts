import { IMessage } from "../context/reducers/messagesReducer";
import { sendMessage } from "../utils/socket";
import { useCommtContext } from "../context/Context";
import { addMessage } from "../context/actions/messagesAction";
import { updateLastMessage } from "../context/actions/roomsActions";
import { aesEncrypt, rsaEncrypt } from "../utils/encryption";

interface onSendMessageProps {
  message: IMessage;
  roomId: string;
  chatRoomAuthId: string;
}

const useSendMessage = () => {
  const {
    state: {
      users: { selfUser, users },
      rooms,
      app: {
        configs: { secretKey, apiKey, projectId, e2e },
      },
    },
    dispatch,
  } = useCommtContext();

  const onSendMessage = (props: onSendMessageProps) => {
    const { message, roomId, chatRoomAuthId } = props;
    let encryptedMessage = message.text;

    // Encrypt message with RSA; If the tenant enabled E2E encryption and it's not a system message
    if (e2e && !message.system) {
      // TODO: Investigation for group/community chat RSA encryption
      const room = rooms.find((room) => room.roomId === roomId);

      if (room && !room.groupName) {
        // Find the opposite user ID among one-to-one room participants
        const oppositeUserId = room.participants.find(
          (id) => id !== selfUser?._id && !id.startsWith("system")
        );

        const oppositeUserPck = users.find(
          (user) => user._id === oppositeUserId
        )?.publicKey;

        // If the opposite user has a public key, the message text is encrypted using RSA.
        if (oppositeUserPck) {
          encryptedMessage = rsaEncrypt({
            message: encryptedMessage,
            publicKey: oppositeUserPck,
          });
        }
      }
    }

    // AES encryption is the standard encryption method and encrypts every messages. It encrypts data by generating IV.
    const { encryptedMessage: encryptedMsg, iv } = aesEncrypt({
      key: secretKey,
      messageData: JSON.stringify({
        message: { ...message, text: encryptedMessage },
        roomId,
        chatRoomAuthId,
      }),
    });

    sendMessage(
      {
        message: encryptedMsg,
        iv,
      },
      (status) => {
        // If the message sending succesfully
        if (status === "success") {
          // add the message to context
          addMessage({ message, roomId: roomId })(dispatch);
          updateLastMessage({
            lastMessage: message,
            roomId: roomId,
          })(dispatch);
        }
      },
      //handle Log params
      {
        apiKey,
        projectId,
        chatAuthId: selfUser!.chatAuthId,
        chatRoomAuthId,
      }
    );
  };

  return onSendMessage;
};

export default useSendMessage;
