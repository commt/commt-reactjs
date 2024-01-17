import { MDBCardHeader, MDBCardTitle, MDBCardSubTitle } from "mdb-react-ui-kit";
import Avatar from "./Avatar";
import PopUpButtons, { PopUpButtonsProps } from "./PopUpButtons";
import { useCommtContext } from "../context/Context";
import useTypingUsers from "../hooks/useTypingUsers";
import { IndicatorProps } from "../context/reducers/appReducer";

interface ChatHeaderProps extends PopUpButtonsProps {
  onUserProfileClick?: () => void;
}

const ChatHeader = ({ popUpButtons, onUserProfileClick }: ChatHeaderProps) => {
  const {
    state: {
      users: { selfUser, users },
      rooms,
      app: {
        selectedRoom: { roomId, participants },
        configs: { indicators },
      },
    },
  } = useCommtContext();

  const room = rooms.find((room) => room.roomId === roomId);
  const typingUserNames = useTypingUsers(room?.chatRoomAuthId ?? null);

  // If 'room' exists, find the opposite user Id in 'room.participants'; otherwise, search in 'participants'.
  const oppositeUserId = room
    ? room.groupName
      ? null
      : room.participants.find(
          (id) => id !== selfUser?._id && !id.startsWith("system")
        )
    : participants?.find(
        (id) => id !== selfUser?._id && !id.startsWith("system")
      );

  const oppositeUser = users.find(({ _id }) => _id === oppositeUserId);

  const renderMembersOrOnline = () => {
    if (room?.groupAvatar) {
      // This room is a group chat
      const memberNames =
        users
          .filter(({ _id }) => room.participants.includes(_id))
          .map(({ username }) => username)
          .slice(0, 3)
          .join(", ") +
        (room.participants.length > 3
          ? ` and ${room.participants.length - 3}`
          : "");

      return typingUserNames ? (
        <MDBCardSubTitle style={{ color: "#1B9C32" }}>
          {typingUserNames} typing...
        </MDBCardSubTitle>
      ) : (
        <MDBCardSubTitle style={{ color: "#B3B6B7" }}>
          {memberNames}
        </MDBCardSubTitle>
      );
    }
    // This is room is a 1:1 private chat room so check oppositeUser online and typing status
    return typingUserNames ? (
      <MDBCardSubTitle style={{ color: "#1B9C32" }}>typing...</MDBCardSubTitle>
    ) : (
      indicators.includes(IndicatorProps.ONLINE) &&
        (oppositeUser?.online ? (
          <MDBCardSubTitle style={{ color: "#B3B6B7" }}>Online</MDBCardSubTitle>
        ) : null)
    );
  };

  return (
    <MDBCardHeader className="d-flex align-items-center ps-0 p-1">
      {(room?.groupAvatar || oppositeUser?.avatar) && (
        <Avatar
          uri={room?.groupAvatar ?? oppositeUser?.avatar}
          online={oppositeUser?.online ?? false}
          height={"%100"}
          className="d-flex align-self-center me-3 rounded-circle"
          onClick={onUserProfileClick}
        />
      )}
      <div className="p-2 text-start">
        <MDBCardTitle style={{ color: "#0D0F0F" }}>
          {room?.groupName ?? oppositeUser?.username}
        </MDBCardTitle>
        {renderMembersOrOnline()}
      </div>
      {popUpButtons && (
        <div className="ms-auto">
          <PopUpButtons popUpButtons={popUpButtons} />
        </div>
      )}
    </MDBCardHeader>
  );
};

export default ChatHeader;
