import { useCommtContext } from "../context/Context";
import { setSelfUser } from "../context/actions/usersActions";
import { UserProps } from "../context/reducers/usersReducer";

const useSetSelfUser = () => {
  const { dispatch } = useCommtContext();

  const setSelfUserAction = (selfUser: UserProps) => {
    setSelfUser(selfUser)(dispatch);
  };

  return setSelfUserAction;
};

export default useSetSelfUser;
