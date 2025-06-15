import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";


export type tabsType = {
     activeTab:number
     setActiveTab:React.Dispatch<React.SetStateAction<number>>
     messageIMageModal:boolean
     filesModal:boolean
     groupFilesModal:boolean
     groupIMageModal:boolean
     updateBioModal:boolean
     updateLocationModal:boolean
     updateProfileIMageModal:boolean
     updateMobileModal:boolean
     isGroupModalOpen:boolean
     isContactModalOpen:boolean
     isAddContactToGroupModalOpen:boolean
     isPhoneCallModalOpen:boolean
     isVideoCallModalOpen:boolean
     toggleBioModal:() => void
     toggleLocationModal:() => void
     toggleMobileModal:() => void
     toggleProfileImageModal:() => void
    toggleAddContactToGroupModal:() => void
    toggleContactModal:() => void
    toggleGroupModal:() => void
    togglePhoneCallModal:() => void
    toggleVideoCallModal:() => void
    toggleFilesModal:() => void
        toggleGroupImageModal:() => void
        toggleGroupFilesModal:() => void
        toggleMessageImageModal:() => void
   
    tabData:unknown[]
    setIsDarkMode:React.Dispatch<React.SetStateAction<boolean>>
    isDarkMode: boolean
  };
  export interface IMAGE {
    publicId:string;
     url:string;
  }
  
export interface USER {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    profile_image:string,
    about:string,
    mobile:string
    status:string,
    date_created:string, 
    last_seen:string,
    country:string,
    resettoken:string
  }
  
    
export interface CHATMESSAGES  {
  sender_id:  string | undefined,
  receiver_id: string,
  message: string,
  media:string,
  files:string,
   type: string,
status:string,
   timestamp: string,

}
  
    
export interface SENDMESSAGE  {
  
  sender_id:  string | undefined,
  receiver_id: string,
  message: string,
  media:string,
  files:string,


}

    
export interface GROUPCHATMESSAGES  {
  group_id: string | undefined,
  user_id: string | undefined,
  message: string,
  media:string,
  files:string,
   timestamp: string,

}

  
    
export interface GROUPMEMBERS {
  group_id:string;
  user_id:string,
  timestamp:string,
}

    
export interface CONTACTS {
  id: string,
  firstname: string,
  userid:string,
  contactid:string,
  lastname: string,
  email: string,
  image:string,
  mobile:string
  country:string
  profile_image:string
  about:string
}

    
export interface GROUPS {
  id: string,
  name: string,
  description:string,
  createdby:string
  members: CONTACTS[],
 timestamp:string,
 group_image:string
 
}

export interface RECENTUSERS {
  receiver_id: string,
  user_id:string,
  timestamp:string
}

export interface SENDGROUPMESSAGE {
  group_id: string
  sender_id:string | undefined
  message:string
  media:string,
  files:string
}

export interface SENDMESSAGE{
  sender_id:string | undefined
  receiver_id:string
  message:string
  media:string,
  files:string
}

export interface State {
  messages: CHATMESSAGES[]  ;
  currentMessage: string;
  currentTyping: boolean;
  groupMessages: GROUPCHATMESSAGES[]  ;
  currentGroupMessage: string;
  currentGroupTyping: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentMedia: any; // Or File | null if you're using media
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentFile: any;  // Or File | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentGroupMedia: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentGroupFile: any;
  onlineUsers: USER[];
  group: GROUPS ;
  receiver: CONTACTS  ;
}

export type Action =
 | { type: 'SET_CURRENT_TYPING'; payload: boolean }
  | { type: 'SET_CURRENT_GROUPTYPING'; payload: boolean }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'SET_CURRENTGROUP_MEDIA'; payload: any } // Type as needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'SET_CURRENTGROUP_FILE'; payload: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'SET_CURRENTMEDIA'; payload: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: 'SET_CURRENTFILE'; payload: any }
  | { type: 'SET_CURRENTMESSAGE'; payload: string }
  | { type: 'SEND_MESSAGE'; payload:   CHATMESSAGES}
  | { type: 'RECEIVE_MESSAGE'; payload: CHATMESSAGES }
  | { type: 'RECEIVE_MESSAGEHISTORY'; payload: CHATMESSAGES[] }
  | { type: 'SET_CURRENTGROUP_MESSAGE'; payload: string }
  | { type: 'SEND_GROUPMESSAGE'; payload:  GROUPCHATMESSAGES  }
  | { type: 'RECEIVE_GROUPMESSAGE'; payload: GROUPCHATMESSAGES }
  | { type: 'RECEIVE_GROUPMESSAGE_HISTORY'; payload: GROUPCHATMESSAGES[] }
  | { type: 'SET_RECEIVER'; payload: CONTACTS }
  | { type: 'SET_GROUP'; payload: GROUPS  }
  | { type: 'SET_ONLINE_USERS'; payload: USER[] };
  

export type chatType = {
  receiver:CONTACTS | null
  group:GROUPS | null
  sendPrivateMessage:() => void
  sendGroupMessage:() => void
  groupMessages:GROUPCHATMESSAGES[]
  currentGroupMessage:string
  messages:CHATMESSAGES[]
  currentMessage:string
   currentMedia:File
   currentFile:File
   currentTyping:boolean
   currentGroupTyping:boolean
   currentGroupMedia:File
   currentGroupFile:File
  state:State
  dispatch: React.Dispatch<Action>
  socket:MutableRefObject<void | Socket | null>

  

}
  

