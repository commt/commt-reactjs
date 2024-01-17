import { useEffect, useState } from "react";
import { MDBTypography } from "mdb-react-ui-kit";
import dayjs from "dayjs";
import RoomCard from "./RoomCard";
import { RoomProps } from "../context/reducers/roomsReducer";
import { useCommtContext } from "../context/Context";

const sortRooms = (rooms: RoomProps[]) => {
  // sort the rooms according to last message time, uses of sort function => https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
  return rooms.sort((firstItem: RoomProps, secondItem: RoomProps) => {
    if (firstItem.lastMessage && secondItem.lastMessage) {
      return dayjs(secondItem.lastMessage.createdAt).diff(
        dayjs(firstItem.lastMessage.createdAt)
      );
    }
    return 0;
  });
};

const MessageList = () => {
  const {
    state: {
      users: { selfUser, users },
      rooms,
      app: { searchValue },
    },
  } = useCommtContext();

  const [filteredRooms, setFilteredRooms] = useState<RoomProps[]>([]);

  const getName = (room: RoomProps) => {
    if (room.groupName) {
      return room.groupName.toLowerCase();
    } else {
      const oppositeUserId = room.participants.find(
        (id) => id !== selfUser?._id && !id.startsWith("system")
      );
      return (
        users
          .find((user) => user._id === oppositeUserId)
          ?.username.toLowerCase() || ""
      );
    }
  };

  const filterRooms = () => {
    const lowerCaseSearch = searchValue.toLowerCase();
    return (
      rooms
        .filter((room) => {
          const roomName = getName(room);
          return roomName.includes(lowerCaseSearch);
        })
        // Sort the rooms based on the index of the search value in their names.This ensures that rooms with a closer match to the search appear first.
        .sort((firstRoom, secondRoom) => {
          const firstName = getName(firstRoom);
          const secondName = getName(secondRoom);
          return (
            firstName.indexOf(lowerCaseSearch) -
            secondName.indexOf(lowerCaseSearch)
          );
        })
    );
  };

  useEffect(() => {
    if (searchValue) {
      setFilteredRooms(filterRooms());
    } else {
      setFilteredRooms(sortRooms(rooms));
    }
  }, [searchValue, rooms]);

  return (
    <div
      className="scrollable"
      style={{ position: "relative", height: "400px" }}
    >
      <MDBTypography listUnStyled className="mb-0">
        {filteredRooms.map((room: RoomProps, index) => (
          <RoomCard key={index} room={room} />
        ))}
      </MDBTypography>
    </div>
  );
};

export default MessageList;
