import React, {
  FC,
  createContext,
  useReducer,
  Dispatch,
  useContext,
} from "react";
import {
  rootReducer,
  CommtContextActions,
  CommtContextData,
  InitialState,
} from "./reducers";
import SocketController from "../utils/SocketController";

// Create a new context
const CommtContext = createContext<{
  state: CommtContextData;
  dispatch: Dispatch<CommtContextActions>;
}>({
  state: InitialState,
  dispatch: () => null,
});

export const useCommtContext = () => useContext(CommtContext);

interface CommtProviderProps {
  children: React.ReactNode;
}

// Define the context provider component
export const CommtContextProvider: FC<CommtProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, InitialState);

  return (
    <CommtContext.Provider value={{ state, dispatch }}>
      {children}
      {state.users.selfUser && state.app.configs.tenantId && (
        <SocketController />
      )}
    </CommtContext.Provider>
  );
};
