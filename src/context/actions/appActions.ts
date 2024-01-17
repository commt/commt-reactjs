import { Dispatch } from "react";
import { CommtContextActions } from "../reducers";
import { SelectedRoomProps, ConfigsProps } from "../reducers/appReducer";

export const setSearchValue =
  (searchValue: string) => (dispatch: Dispatch<CommtContextActions>) => {
    dispatch({ type: "SET_SEARCH_VALUE", payload: searchValue });
  };

export const setConfigs =
  (configsData: ConfigsProps) => (dispatch: Dispatch<CommtContextActions>) => {
    dispatch({ type: "SET_CONFIGS", payload: configsData });
  };

export const setSelectedRoom =
  (selectedRoom: SelectedRoomProps) =>
  (dispatch: Dispatch<CommtContextActions>) => {
    dispatch({ type: "SET_SELECTED_ROOM", payload: selectedRoom });
  };
