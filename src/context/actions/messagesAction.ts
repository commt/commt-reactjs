import { Dispatch } from "react";
import { CommtContextActions } from "../reducers";
import {
  IMessage,
  IMessagesData,
} from "../../context/reducers/messagesReducer";

export interface AddMessageProps {
  roomId: string;
  message: IMessage;
}

export interface AddMoreMessagesProps {
  roomId: string;
  messages: IMessage[];
}

export const setMessages =
  (messages: IMessagesData) => (dispatch: Dispatch<CommtContextActions>) => {
    dispatch({ type: "SET_MESSAGES", payload: messages });
  };

export const addMessage =
  (data: AddMessageProps) => (dispatch: Dispatch<CommtContextActions>) => {
    dispatch({ type: "ADD_MESSAGE", payload: data });
  };

export const addMoreMessages =
  (data: AddMoreMessagesProps) => (dispatch: Dispatch<CommtContextActions>) => {
    dispatch({ type: "ADD_MORE_MESSAGES", payload: data });
  };

export const deleteMessages =
  (roomId: string) => (dispatch: Dispatch<CommtContextActions>) => {
    dispatch({ type: "DELETE_MESSAGES", payload: roomId });
  };
