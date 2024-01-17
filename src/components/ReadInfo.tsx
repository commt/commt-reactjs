import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import SingleCheck from "../assets/icons/svg/SingleCheck";
import FilledDoubleCheck from "../assets/icons/svg/FilledDoubleCheck";
import { RoomProps } from "../context/reducers/roomsReducer";
import { useCommtContext } from "../context/Context";
import { IndicatorProps } from "../context/reducers/appReducer";
dayjs.extend(isSameOrAfter);

const ReadInfo = ({ room }: { room: RoomProps }) => {
  const {
    state: {
      users: { selfUser },
      app: {
        configs: { indicators },
      },
    },
  } = useCommtContext();

  const { lastMessage, lastMessageReadToken, unReadMessageCount, groupAvatar } =
    room;

  const isLastMessageBySelfUser = room.lastMessage?.user._id === selfUser?._id;

  if (!lastMessage) return null;
  // Check if the "MESSAGE_READ" indicator is enabled
  if (isLastMessageBySelfUser) {
    // If last message belongs to self user
    switch (true) {
      // If the room is a community room
      case !!groupAvatar || !indicators.includes(IndicatorProps.MESSAGE_READ): {
        return <SingleCheck />;
      }
      // Receiver user had read the message
      case dayjs(lastMessageReadToken).isSameOrAfter(
        dayjs(lastMessage.createdAt)
      ): {
        return <FilledDoubleCheck />;
      }
      // Receiver user has not read the message
      case dayjs(lastMessageReadToken).isBefore(dayjs(lastMessage.createdAt)): {
        return <SingleCheck />;
      }
      default: {
        return null;
      }
    }
  } else if (unReadMessageCount > 0) {
    // If last message belongs to other user
    return (
      <span className="badge bg-danger rounded-pill">
        {room.unReadMessageCount}
      </span>
    );
  }
  return null;
};

export default ReadInfo;
