import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Bubble from "./Bubble";
import LoadEarlier, { LoadMoreMessagesProps } from "./LoadEarlier";
import { useCommtContext } from "../context/Context";
import { RoomProps } from "../context/reducers/roomsReducer";
import { IMessage } from "../context/reducers/messagesReducer";
import { IndicatorProps } from "../context/reducers/appReducer";
import { sendReadToken } from "../utils/socket";
import Dates from "./Dates";

type ChatProps = {
  loadMoreMessages: LoadMoreMessagesProps;
};

const Chat = ({ loadMoreMessages }: ChatProps) => {
  const {
    state: {
      users: { selfUser },
      rooms,
      messages,
      app: {
        selectedRoom: { roomId },
        configs: { indicators, apiKey, projectId },
      },
    },
  } = useCommtContext();

  const [activeRoom, setActiveRoom] = useState<RoomProps | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const room = rooms.find((room: RoomProps) => room.roomId === roomId);
    setActiveRoom(room);
  }, [roomId, rooms]);

  useEffect(() => {
    // Check for configs in current development env and render the elements depends on the configuration limits
    // Check if the last message belongs the opposite user
    if (
      indicators.includes(IndicatorProps.MESSAGE_READ) &&
      activeRoom &&
      activeRoom?.lastMessage?.user?._id !== selfUser?._id
    ) {
      // Update the room's lastMessageReadToken field
      sendReadToken(
        {
          token: dayjs().valueOf(),
          chatRoomAuthId: activeRoom.chatRoomAuthId,
        },
        //handle Log params
        {
          apiKey,
          projectId,
          chatAuthId: selfUser!.chatAuthId,
        }
      );
    }
  }, [indicators, activeRoom?.lastMessage]);

  useEffect(() => {
    // Scroll to the bottom of chat container
    containerRef.current?.scrollTo({
      top: containerRef.current?.scrollHeight,
    });
  }, [activeRoom?.roomId, activeRoom?.lastMessage]);

  return (
    <div
      id={roomId}
      style={{
        position: "relative",
        height: "400px",
        backgroundColor: "#F8FAFA",
      }}
      className="pt-3 pe-3 d-flex flex-column justify-content-end"
    >
      <div className="scrollable" ref={containerRef}>
        {activeRoom && (
          <LoadEarlier
            loadMoreMessages={loadMoreMessages}
            activeRoom={activeRoom}
            containerRef={containerRef}
          />
        )}
        {activeRoom &&
          messages[activeRoom.roomId]?.length > 0 &&
          [...messages[activeRoom.roomId]]
            .reverse()
            .map((message: IMessage, index, arr) => (
              <>
                <Dates
                  currentMessage={message}
                  previousMessage={arr[index - 1]}
                />
                <Bubble
                  currentMessage={message}
                  activeRoom={activeRoom}
                  key={index}
                />
              </>
            ))}
      </div>
    </div>
  );
};

export default Chat;
