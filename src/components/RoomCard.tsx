import { useEffect } from "react";
import calendar from "dayjs/plugin/calendar";
import dayjs from "dayjs";
import Avatar from "./Avatar";
import ReadInfo from "./ReadInfo";
import { RoomProps } from "../context/reducers/roomsReducer";
import { useCommtContext } from "../context/Context";
import { setSelectedRoom } from "../context/actions/appActions";
import { IMessage } from "../context/reducers/messagesReducer";
import { updateUnreadMsgCount } from "../context/actions/roomsActions";
import useTypingUsers from "../hooks/useTypingUsers";
dayjs.extend(calendar);

// Convert date to correct display depending on time from current day
const formattedDate = (time: Date | number | undefined) => {
  return dayjs(time).calendar(null, {
    sameDay: "HH:MM", // If last message was today show time
    lastDay: "[Yesterday]", // If last message was the day before show "yesterday"
    lastWeek: "DD/MM/YYYY", // If last message was the last week show date
    sameElse: "DD/MM/YYYY", // If last message later then the day before show date
  });
};

interface RoomCardProps {
  room: RoomProps;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const {
    state: {
      users: { selfUser, users },
      messages,
    },
    dispatch,
  } = useCommtContext();

  const isLastMessageBySelfUser = room.lastMessage?.user._id === selfUser?._id;
  const typingUserNames = useTypingUsers(room.chatRoomAuthId);

  const oppositeUserId = room.groupName
    ? null
    : room.participants.find(
        (id) => id !== selfUser?._id && !id.startsWith("system")
      );
  const oppositeUser = oppositeUserId
    ? users.find((user) => user._id === oppositeUserId)
    : null;

  useEffect(() => {
    // filter the messages and check if the message sender is opposite user and the message time is newer than the last message read token. In this way that proofs the message was after the last time user had visited screen.
    const unReadMessages = messages[room.roomId]?.filter(
      (message: IMessage) =>
        dayjs(message.createdAt).isAfter(dayjs(room.lastMessageReadToken)) &&
        message.user._id !== selfUser?._id
    );
    // update room's context value
    updateUnreadMsgCount({
      roomId: room.roomId,
      count: unReadMessages?.length ?? 0,
    })(dispatch);
  }, [messages[room.roomId], room.lastMessageReadToken]);

  return (
    <li className="p-2 border-bottom">
      <a
        href={"#"}
        className="d-flex justify-content-between"
        onClick={() => {
          setSelectedRoom({ roomId: room.roomId })(dispatch);
        }}
      >
        <div className="d-flex flex-row">
          <Avatar
            uri={room.groupAvatar ?? oppositeUser?.avatar}
            online={oppositeUser?.online ?? false}
            className="d-flex align-self-center me-4 rounded-circle"
          />
          <div className="pt-1 text-start">
            <p className="fw-bold mb-0" style={{ color: "#0D0F0F" }}>
              {room.groupName ?? oppositeUser?.username}
            </p>
            {typingUserNames ? (
              <p className="small" style={{ color: "#1B9C32" }}>
                {room.groupName ? typingUserNames : null} typing...
              </p>
            ) : (
              <p className="small" style={{ color: "#B3B6B7" }}>
                {!isLastMessageBySelfUser && room.groupName
                  ? `${room.lastMessage?.user.name}: `
                  : ""}
                {room.lastMessage?.text &&
                  room.lastMessage.text.slice(0, 16) +
                    (room.lastMessage.text.length > 16 ? "..." : "")}
              </p>
            )}
          </div>
        </div>
        <div className="pt-1">
          <p className="small mb-2" style={{ color: "#B3B6B7" }}>
            {formattedDate(room.lastMessage?.createdAt)}
          </p>
          <span className="float-end">
            <ReadInfo room={room} />
          </span>
        </div>
      </a>
    </li>
  );
};

export default RoomCard;
