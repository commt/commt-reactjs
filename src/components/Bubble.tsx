import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import FilledDoubleCheck from "../assets/icons/svg/FilledDoubleCheck";
import SingleCheck from "../assets/icons/svg/SingleCheck";
import Avatar from "./Avatar";
import { IMessage } from "../context/reducers/messagesReducer";
import { RoomProps } from "../context/reducers/roomsReducer";
import { useCommtContext } from "../context/Context";
import { IndicatorProps } from "../context/reducers/appReducer";
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrAfter);

interface BubbleProps {
  currentMessage: IMessage;
  activeRoom: RoomProps | undefined;
}

const ReadInfo = ({ currentMessage, activeRoom }: BubbleProps) => {
  const {
    state: {
      users: { selfUser },
    },
  } = useCommtContext();

  // If current message belongs to self user
  if (currentMessage?.user?._id === selfUser?._id && activeRoom) {
    // If this message belongs the community room
    if (activeRoom.groupAvatar) {
      return <SingleCheck />;
    } else {
      // Receiver user had read the message
      return dayjs(activeRoom.lastMessageReadToken).isSameOrAfter(
        dayjs(currentMessage?.createdAt)
      ) ? (
        <FilledDoubleCheck />
      ) : (
        <SingleCheck />
      );
    }
  }
};

const Bubble = ({ currentMessage, activeRoom }: BubbleProps) => {
  const {
    state: {
      users: { selfUser },
      app: {
        configs: { indicators },
      },
    },
  } = useCommtContext();

  const position = selfUser?._id === currentMessage.user._id ? "right" : "left";

  return (
    <div
      className={`d-flex flex-row justify-content-${
        position === "right" ? "end" : "start"
      }`}
    >
      {/** Avatar shown for only community room */}
      {position == "left" && activeRoom?.groupAvatar && (
        <Avatar uri={currentMessage.user.avatar} width={"45"} height={"%100"} />
      )}
      <div
        className={
          "p-2 mb-1 rounded-3" +
          (position === "left" ? " ms-3" : " me-3 text-white")
        }
        style={{
          backgroundColor: position === "right" ? "#DC4D57" : "#ECEDED",
          maxWidth: "20rem",
        }}
      >
        <p
          className="small mb-1 text-start"
          style={{
            color: position === "right" ? "#FFF" : "#343A3C",
            whiteSpace: "pre-line",
          }}
        >
          {currentMessage.text}
        </p>

        <div className="d-flex align-items-center justify-content-end">
          <p
            style={{
              color: position === "right" ? "#D9DBDB" : "#B3B6B7",
              fontSize: "12px",
            }}
          >
            {dayjs(currentMessage.createdAt).format("h:mm a")}
          </p>

          {indicators.includes(IndicatorProps.MESSAGE_READ) &&
            position === "right" && (
              <div className="ms-2">
                <ReadInfo
                  currentMessage={currentMessage}
                  activeRoom={activeRoom}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Bubble;
