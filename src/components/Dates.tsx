import { IMessage } from "../context/reducers/messagesReducer";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
dayjs.extend(calendar);

const formattedDate = (time: Date | number | undefined) => {
  return dayjs(time).calendar(null, {
    sameDay: "[Today]", // The same day (Today)
    lastDay: "[Yesterday]", // The day before (Yesterday)
    lastWeek: "MMM DD, YYYY", // Last week (May 06, 2023)
    sameElse: "MMM DD, YYYY", // Everything else (May 06, 2023)
  });
};

interface DatesProps {
  currentMessage: IMessage;
  previousMessage: IMessage;
}

const Dates = ({ currentMessage, previousMessage }: DatesProps) => {
  // Check the times of consecutive messages to compare if they are on the same day or not
  const isSameDay = dayjs(currentMessage?.createdAt).isSame(
    previousMessage?.createdAt,
    "day"
  );
  if (!isSameDay) {
    return (
      <div className="d-flex align-items-center m-3">
        <span className="border-bottom w-50" style={{ color: "#ECEDED" }} />
        <p className="small me-3 ms-3 text-nowrap" style={{ color: "#B3B6B7" }}>
          {formattedDate(currentMessage?.createdAt)}
        </p>
        <span className="border-bottom w-50" style={{ color: "#ECEDED" }} />
      </div>
    );
  }
};

export default Dates;
