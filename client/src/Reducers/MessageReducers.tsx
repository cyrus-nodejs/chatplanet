/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, State } from "../utils/types";
import React from "react";

const getSavedReceiver = (): any => {
  const savedReceiver = localStorage.getItem("receiver");
  try {
    return savedReceiver && savedReceiver !== "undefined"
      ? JSON.parse(savedReceiver)
      : {};
  } catch (e) {
    console.warn("Invalid JSON in localStorage for receiver", e);
    return {};
  }
};

const getSavedGroup = (): any => {
  const savedGroup = localStorage.getItem("group");
  try {
    return savedGroup && savedGroup !== "undefined"
      ? JSON.parse(savedGroup)
      : {};
  } catch (e) {
    console.warn("Invalid JSON in localStorage for group", e);
    return {};
  }
};
export const initialState:State =  {
    messages:[],
    currentMessage:"",
    currentTyping : false,
    groupMessages:[],
     currentGroupMessage:"",
    currentGroupTyping : false,
     currentMedia:null,
     currentFile:null,
     currentGroupMedia:null,
     currentGroupFile:null,
     onlineUsers: [],
     group: getSavedGroup(),
     receiver: getSavedReceiver() 
}


  //  | { type: 'SET_CURRENT_TYPING'; payload: boolean  }
  //     | { type: 'SET_CURRENT_GROUPTYPING'; payload: boolean  }
export const messageReducer : React.Reducer<State, Action> = (state, action) =>{
    switch (action.type) {
      case 'SET_CURRENTGROUP_MEDIA':
         return { ...state, currentGroupMedia: action.payload };
         
         case 'SET_CURRENTGROUP_FILE':
           return { ...state, currentGroupFile: action.payload  };

       case 'SET_CURRENTMEDIA':
         return { ...state, currentMedia: action.payload };

         case 'SET_CURRENTFILE':
           return { ...state, currentFile: action.payload  };

       case 'SET_CURRENTMESSAGE':
            return { ...state, currentMessage: action.payload };

       case 'SET_CURRENT_TYPING':
            return { ...state,  currentTyping: action.payload };

       case 'SET_CURRENT_GROUPTYPING':
            return { ...state,  currentGroupTyping: action.payload };

        case 'SEND_MESSAGE':
          return { ...state, messages: [...state.messages, action.payload], currentMessage:'' }

        case 'RECEIVE_MESSAGE':
          return { ...state, messages: [...state.messages, action.payload] };

          case 'RECEIVE_MESSAGEHISTORY': 
            return { ...state, messages:  action.payload };

          case 'SET_CURRENTGROUP_MESSAGE':
            return { ...state, currentGroupMessage: action.payload };

          case 'SEND_GROUPMESSAGE':
            return { ...state, groupMessages: [...state.groupMessages, action.payload], currentGroupMessage:''  };

          case 'RECEIVE_GROUPMESSAGE':
            return { ...state, groupMessages: [...state.groupMessages, action.payload] };

            case 'RECEIVE_GROUPMESSAGE_HISTORY':
            return { ...state, groupMessages:  action.payload };

                case 'SET_RECEIVER':
            return { ...state, receiver:  action.payload };
      
                case 'SET_GROUP':
            return { ...state, group:  action.payload };
      
                case 'SET_ONLINE_USERS':
            return { ...state, onlineUsers:  action.payload };
      
      
        default:
          return state;
      }
}

