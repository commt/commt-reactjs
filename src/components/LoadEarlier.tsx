import { useEffect, useState } from "react";
import { MDBSpinner } from "mdb-react-ui-kit";
import { addMoreMessages } from "../context/actions/messagesAction";
import { useCommtContext } from "../context/Context";
import { MessageActionProps } from "../hooks/useSetMessages";
import { RoomProps } from "../context/reducers/roomsReducer";
import messageFormat from "../utils/messageFormat";

export type LoadMoreMessagesProps = (props: {
  roomId: string;
  skip: number;
  limit: number;
}) => Promise<
  | {
      messages: MessageActionProps[];
      hasNext?: boolean;
    }
  | undefined
>;

interface LoadEarlierProps {
  activeRoom: RoomProps;
  loadMoreMessages: LoadMoreMessagesProps;
  containerRef: React.RefObject<HTMLDivElement>;
}

const LoadEarlier = ({
  activeRoom,
  loadMoreMessages,
  containerRef,
}: LoadEarlierProps) => {
  const {
    state: {
      messages,
      users: { users },
    },
    dispatch,
  } = useCommtContext();

  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  const handleScroll = async () => {
    // TODO: scrollTop value will be reorganised and tolerant values will be given
    // Check if the user has scrolled to the top of the container and not currently loading
    if (containerRef.current?.scrollTop === 0 && !isLoading) {
      await onLoadEarlier();
    }
  };

  useEffect(() => {
    // Listen scroll event
    containerRef.current?.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the scroll event listener
    // Also reset states to default values
    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
      setHasMore(true);
      setIsLoading(false);
    };
  }, [activeRoom]);

  const getMoreMessages = async () => {
    // Retrieve earlier messages
    const data = await loadMoreMessages({
      roomId: activeRoom.roomId,
      skip: messages[activeRoom.roomId].length,
      limit,
    });
    // Check if data retrieval was successful
    if (data) {
      const { messages: messagesArray, hasNext } = data;
      setHasMore(hasNext ?? true);

      return messageFormat({
        users,
        isGroupChat: activeRoom.groupName ? true : false,
        messages: messagesArray,
      });
    }
    return [];
  };

  const onLoadEarlier = async () => {
    setIsLoading(true);
    // If there are more messages start request
    if (hasMore) {
      const messageArr = await getMoreMessages();
      // Add earlier messages to context
      addMoreMessages({ roomId: activeRoom.roomId, messages: messageArr })(
        dispatch
      );
    }
    setIsLoading(false);
  };

  return (
    isLoading && (
      <div className="d-flex justify-content-center mb-4">
        <MDBSpinner color="secondary" />
      </div>
    )
  );
};

export default LoadEarlier;
