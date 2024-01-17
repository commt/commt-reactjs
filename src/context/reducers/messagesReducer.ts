import { CommtContextActions } from ".";

/**
 * Custom Message Interface:
 * - 'type' defines the message format. It is 'text' for default messages.
 * - If the 'system' property is true, 'type' can be 'text', 'image', or 'button'.
 * - For 'button' type, 'onPress' and 'text' properties are used.
 * - For 'text' type, the 'text' property is used.
 * - For 'image' type, the 'image' property is used.
 */

export interface User {
  _id: string | number;
  name?: string;
  avatar?: string;
}

export interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  type: string;
  user: User;
  senderId: string | number;
  image?: string;
  system?: boolean;
  onPress?: () => void;
}

export interface IMessagesData {
  [roomId: string]: Array<IMessage>;
}

export function messagesReducer(
  state: IMessagesData,
  action: CommtContextActions
) {
  switch (action.type) {
    case "SET_MESSAGES": {
      return action.payload;
    }

    case "ADD_MESSAGE": {
      const { roomId, message } = action.payload;
      const previousMessages = state && state[roomId];

      const messages = previousMessages
        ? [message, ...previousMessages]
        : [message];

      return {
        ...state,
        [roomId]: messages,
      };
    }

    case "ADD_MORE_MESSAGES": {
      const { roomId, messages } = action.payload;
      const previousMessages = state && state[roomId];

      const messageArr = previousMessages
        ? [...previousMessages, ...messages]
        : messages;

      return {
        ...state,
        [roomId]: messageArr,
      };
    }

    case "DELETE_MESSAGES": {
      const roomId = action.payload;

      const messages = { ...state };
      delete messages[roomId];

      return messages;
    }

    default: {
      return state;
    }
  }
}
