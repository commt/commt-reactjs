import { useCommtContext } from "../context/Context";

const useGetActiveRoom = () => {
  const {
    state: {
      app: { selectedRoom },
    },
  } = useCommtContext();

  return selectedRoom;
};

export default useGetActiveRoom;
