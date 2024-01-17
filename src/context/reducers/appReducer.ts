import { CommtContextActions } from ".";

export enum IndicatorProps {
  TYPING = "typing",
  ONLINE = "online",
  MESSAGE_READ = "message-read",
}

export type ConfigsProps = {
  e2e: boolean;
  fileSharing: boolean;
  indicators: IndicatorProps[];
  tenantId: string;
  apiKey: string;
  secretKey: string;
  projectId: string;
};

export type SelectedRoomProps = {
  participants?: string[]; // If no room exists, it contains the user ids of the new room to create.
  roomId?: string; // Represents the active chatting roomId. It is undefined if the room not created.
};

export type AppState = {
  searchValue: string;
  configs: ConfigsProps;
  selectedRoom: SelectedRoomProps;
};

export const AppValues: AppState = {
  searchValue: "",
  configs: {
    e2e: false,
    fileSharing: false,
    indicators: [],
    tenantId: "",
    apiKey: "",
    secretKey: "",
    projectId: "",
  },
  selectedRoom: {
    participants: undefined,
    roomId: undefined,
  },
};

export function appReducer(state: AppState, action: CommtContextActions) {
  switch (action.type) {
    case "SET_SEARCH_VALUE": {
      return { ...state, searchValue: action.payload };
    }

    case "SET_CONFIGS": {
      return { ...state, configs: action.payload };
    }

    case "SET_SELECTED_ROOM": {
      return { ...state, selectedRoom: action.payload };
    }

    default: {
      return state;
    }
  }
}
