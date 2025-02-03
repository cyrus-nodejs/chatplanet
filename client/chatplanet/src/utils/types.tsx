import { ReactNode } from "react";

export type tabsType = {
     activeTab:number
     setActiveTab:React.Dispatch<React.SetStateAction<number>>
    // tabsContent:string,
    // setTabsContent:React.Dispatch<React.SetStateAction<string>>
    // handleTabs:() => void
    // setTabs:React.Dispatch<React.SetStateAction<boolean>>;
    // tabs:boolean
    toggleAddContactToGroupModal:() => void
    isAddContactToGroupModalOpen:boolean
    toggleContactModal:() => void
    isContactModalOpen:boolean
    isGroupModalOpen:boolean
    toggleGroupModal:() => void
    togglePhoneCallModal:() => void
    toggleVideoCallModal:() => void
    isPhoneCallModalOpen:boolean
    isVideoCallModalOpen:boolean
    tabData:unknown[]
    setIsDarkMode:React.Dispatch<React.SetStateAction<boolean>>
    isDarkMode: boolean
  };

  
export interface USER {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    image:string,
    mobile:string
    status:string,
    country:string
  }
  
    
export interface CHATMESSAGES {
  sender: ReactNode;
  id:string,
  sender_id: string,
  receiver_id: string,
  message: string,
  type: string,
  status:string,
  timestamp: string,

}

    
export interface  GROUPCHATMESSAGES {
  id:string,
  group_id: string,
  sender_id: string,
  message: string,
  timestamp: string,

}

  
    
export interface GROUPMEMBERS {
  group_id:string;
  userid:string,
  
}

    
export interface CONTACTS {
  id: string,
  firstname: string,
  userid:string
  lastname: string,
  email: string,
  image:string,
  mobile:string
  country:string
}

    
export interface GROUPS {
  id: string,
  name: string,
  createdBy:string
  members: CONTACTS[],
 timestamp:string,
 
}


export type chatType = {
  members:CONTACTS[]
  setMembers:React.Dispatch<React.SetStateAction<CONTACTS[]>>
  receiver:CONTACTS
  group:GROUPS
  message:string
  messages:CHATMESSAGES[]
  sentMessages:CHATMESSAGES[]
  setSentMessages:React.Dispatch<React.SetStateAction<never[]>>
  setMessage:React.Dispatch<React.SetStateAction<string>>
  setMessages:React.Dispatch<React.SetStateAction<never[]>>
  // handleSendMessage:(arg0: USER) => void
  sendPrivateMessage:(arg0: CONTACTS) => void
  sendGroupMessage:(arg0: GROUPS) => void
  onlineusers:USER[]
  groupIndex:number
  setGroupIndex:React.Dispatch<React.SetStateAction<number>>
  contactIndex:number
  setContactIndex:React.Dispatch<React.SetStateAction<number>>
  setReceiver:React.Dispatch<React.SetStateAction<CONTACTS>>
  setGroup:React.Dispatch<React.SetStateAction<GROUPS>>
  setGroupId:React.Dispatch<React.SetStateAction<string>>
  groupMessages:GROUPCHATMESSAGES[]
  setGroupMessages:React.Dispatch<React.SetStateAction<never[]>>
  groupMessage:string
  setGroupMessage:React.Dispatch<React.SetStateAction<string>>
}
