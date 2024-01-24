import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import Avatar from "./Avatar";
import { useCommtContext } from "../context/Context";
import { RoomProps } from "../context/reducers/roomsReducer";
import { addRoom } from "../context/actions/roomsActions";
import { setSelectedRoom } from "../context/actions/appActions";
import { createNewRoom, sendTypingStatus } from "../utils/socket";
import useSendMessage from "../hooks/useSendMessage";
import IDGenerator from "../utils/IDGenerator";
import { IndicatorProps } from "../context/reducers/appReducer";
import { handleLogger } from "../service";
import * as types from "../utils/emitTypes";
import { EmojiPicker } from "react-emoji-search";

interface MessageInputProps {
  withAvatar?: boolean;
  generateRoomAction?: () => Promise<RoomProps>;
}

const MessageInput = ({
  withAvatar = false,
  generateRoomAction,
}: MessageInputProps) => {
  const {
    state: {
      users: { selfUser, users },
      rooms,
      app: {
        selectedRoom: { roomId, participants },
        configs: { tenantId, apiKey, projectId, indicators },
      },
    },
    dispatch,
  } = useCommtContext();

  const onSendMessage = useSendMessage();
  const [text, setText] = useState<string>("");
  const [activeRoom, setActiveRoom] = useState<RoomProps>();
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false);
  const isAlreadyTypingRef = useRef<boolean>(false);

  useEffect(() => {
    const room = rooms.find((room: RoomProps) => room.roomId === roomId);
    setActiveRoom(room);
  }, [roomId, rooms]);

  useEffect(() => {
    // Clear text if the selected room is changed
    text && setText("");
  }, [roomId]);

  useEffect(() => {
    // Check if there is no active room, roomId, and participants are available, indicating that a new room has not been created
    if (!activeRoom && !roomId && participants) {
      // Find new roomId, if the opposite user create a new room and the room participants match the participants
      const newRoomId = rooms.find((room) => {
        return participants.every((id) => room.participants.includes(id));
      })?.roomId;
      // Set new roomId as the selected room.
      setSelectedRoom({ roomId: newRoomId })(dispatch);
    }
  }, [rooms]);

  const typingStatus = (isTyping: boolean) => {
    selfUser &&
      activeRoom &&
      sendTypingStatus(
        {
          isTyping,
          userId: selfUser._id,
          chatRoomAuthId: activeRoom.chatRoomAuthId,
        },
        //handle Log params
        {
          apiKey,
          projectId,
          chatAuthId: selfUser!.chatAuthId,
        }
      );
    isAlreadyTypingRef.current = isTyping;
  };

  useEffect(() => {
    // Check for configs in current development env and render the elements depends on the configuration limits
    if (indicators.includes(IndicatorProps.TYPING)) {
      if (text && !isAlreadyTypingRef.current) {
        // run isTyping true
        typingStatus(true);
      } else if (!text && isAlreadyTypingRef.current) {
        // run isTyping false
        typingStatus(false);
      }
    }
  }, [indicators, text]);

  useEffect(() => {
    return () => {
      if (indicators.includes(IndicatorProps.TYPING)) {
        isAlreadyTypingRef.current && typingStatus(false);
      }
    };
  }, []);

  const createRoom = async () => {
    if (generateRoomAction) {
      const newRoom = await generateRoomAction();
      addRoom(newRoom)(dispatch);
      setSelectedRoom({ roomId: newRoom.roomId })(dispatch);
      return newRoom;
    } else {
      return new Promise<RoomProps>((resolve) => {
        const chatAuthIds = users
          .filter((user) => participants?.includes(user._id))
          .map((user) => user.chatAuthId);

        const data = {
          participants: participants!,
          chatAuthIds,
          selfUserChatAuthId: selfUser!.chatAuthId,
          tenantId,
        };
        // Create new room with socket event
        createNewRoom(
          data,
          (room) => {
            // Update context state value
            addRoom(room)(dispatch);
            setSelectedRoom({ roomId: room.roomId })(dispatch);
            resolve(room);
          },
          // handle Log params
          {
            apiKey,
            projectId,
            chatAuthId: selfUser!.chatAuthId,
          }
        );
      });
    }
  };

  const handleSend = async () => {
    const message = {
      _id: IDGenerator(false),
      text: text.trim(),
      createdAt: new Date(),
      user: {
        _id: selfUser!._id,
      },
      type: "text",
      senderId: selfUser!._id,
    };

    try {
      let newRoom: RoomProps | undefined;
      // If there is no active roomId , create a new room
      if (!roomId && participants) {
        newRoom = await createRoom();
      }
      // Send the message, using activeRoom if available otherwise use to newRoom
      const roomID = activeRoom?.roomId ?? newRoom!.roomId;
      const chatRoomAuthId =
        activeRoom?.chatRoomAuthId ?? newRoom!.chatRoomAuthId;
      onSendMessage({
        message,
        roomId: roomID,
        chatRoomAuthId,
      });
      // Clean the text state
      setText("");
    } catch (error) {
      handleLogger({
        apiKey,
        projectId,
        chatAuthId: selfUser?.chatAuthId,
        error: {
          error,
          event: types.CREATE_NEW_ROOM,
        },
      });
    }
  };

  const handleEmojiPick = (emoji: string) => {
    setText((prevText) => prevText + emoji);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Check if the "Enter" key is pressed without the "Shift" key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      text && text.trim().length > 0 && handleSend();
    }
  };

  return (
    <div className="position-relative">
      <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
        {withAvatar && (
          <Avatar
            uri={selfUser?.avatar}
            width={40}
            height={"100%"}
            className="rounded-circle"
          />
        )}
        <textarea
          className="form-control"
          id="chatMessageInput"
          placeholder="Type your message"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onFocus={() => setIsEmojiOpen(false)}
          rows={text.length > 80 || text.split("\n").length > 1 ? 2 : 1}
          onKeyDown={handleKeyDown}
        />
        {/* // TODO: Enable here once file sharing activated
      <a className="ms-1 text-muted" href="#!">
        <MDBIcon fas icon="paperclip" />
      </a> 
      */}
        <a
          className="ms-3"
          href="#!"
          onClick={() => setIsEmojiOpen((previous) => !previous)}
        >
          <MDBIcon fas icon="smile" style={{ color: "#B3B6B7" }} />
        </a>
        {text && text.trim().length > 0 && (
          <a className="ms-3" href="#!" onClick={handleSend}>
            <MDBIcon fas icon="paper-plane" style={{ color: "#DC4D57" }} />
          </a>
        )}
      </div>

      {isEmojiOpen && (
        <div
          className="position-absolute bottom-100 end-0"
          style={{ height: 400, width: 300 }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiPick}
            mode="light"
            set={"native"}
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
