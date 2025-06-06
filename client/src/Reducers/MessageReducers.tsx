import { Action, State,  } from "../utils/types";
import React from "react";
export const initialState:State =  {
    messages:[],
    currentMessage:"",
    groupMessages:[],
     currentGroupMessage:"",
     currentMedia:null,
     currentFile:null,
     currentGroupMedia:null,
     currentGroupFile:null,
}

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
        default:
          return state;
      }
}

