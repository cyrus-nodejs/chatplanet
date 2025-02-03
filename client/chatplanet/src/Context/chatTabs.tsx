

import { createContext, useEffect,  useState } from "react";

import ChatMenu from "../Pages/MenuItems/ChatMenu"
import Profile from "../Pages/MenuItems/Profile"
import Contact from "../Pages/MenuItems/Contact"
import Languages from "../Pages/MenuItems/Languages"
// import Mode from "../Pages/MenuItems/Mode"
import Groups from "../Pages/MenuItems/Groups"
import Settings from "../Pages/MenuItems/Settings"
// import Homechat from "../Pages/MenuItems/Homechat"
import PrivateMessages from "../Pages/Home/ChatBox/PrivateMessages";
import GroupMessages from "../Pages/Home/ChatBox/GroupMessages";
import { tabsType} from "../utils/types"


// eslint-disable-next-line react-refresh/only-export-components
export const ChatTabsContext = createContext<tabsType>(null!);


export const  ChatTabsProvider = ({ children}:{ children: React.ReactNode } ) => {
   // State to track the active tab
   const [activeTab, setActiveTab] = useState(0);
   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
   const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
   const [isAddContactToGroupModalOpen, setIsAddContactToGroupModalOpen] = useState(false);
   const [isPhoneCallModalOpen, setIsPhoneCallModalOpen] = useState(false);
   const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
   
    // Check the theme in localStorage on initial load
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Set dark mode based on state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
     // Tab content data
  // const Tab1 =   <i className='bx bx-message-rounded-dots bx-sm'></i>
  const Tab3 = <i className='bx bx-message-square-dots bx-sm'></i>
  const Tab2 =<i className='bx bxs-user bx-sm'></i>
  const Tab4 = <i className='bx bx-group bx-sm' ></i>
   const Tab5 = <i className='bx bxs-contact bx-sm' ></i>
  const Tab6 = <i className='bx bx-cog bx-sm' ></i>
  const Tab7 = <i className='bx bx-globe bx-sm'></i>
  const Tab8 = <button
  onClick={() => setIsDarkMode(!isDarkMode)}
  className="rounded-full"
>
   {isDarkMode ? <i className='bx bx-sun bx-sm'></i> : <i className='bx bx-moon bx-sm' ></i>} 
</button>

 
  
 
 

     const tabData = [
        // { label: Tab1, content: (<Homechat />) },
        { label: Tab3, content: (<ChatMenu  />),  content2: (<PrivateMessages />),  title:"Chats"},
        { label: Tab2, content: (<Profile />), content2: (<PrivateMessages />),  title:"Profile" },
        { label: Tab4, content: (<Groups />),   content2:(<GroupMessages />), title:"Groups"},
        { label: Tab5, content: (<Contact  />), content2: (<PrivateMessages />), title:"Contact", },
        { label: Tab6, content: ( <Settings />), content2: (<PrivateMessages />), title:"Settings" },
        { label: Tab7, content: (<Languages />), content2: (<PrivateMessages />), title:"Languages" },
        { label: Tab8, content: (<ChatMenu />), content2: (<PrivateMessages />), title:"Mode" },
      ];
  
 
   // Tab contents



   const toggleContactModal = () => {
    setIsContactModalOpen(!isContactModalOpen);
  }

  const toggleGroupModal = () => {
    setIsGroupModalOpen(!isGroupModalOpen);
  }

  const toggleAddContactToGroupModal = () => {
    setIsAddContactToGroupModalOpen(!isAddContactToGroupModalOpen);
  }
 
   const togglePhoneCallModal = () => {
    setIsPhoneCallModalOpen(!isPhoneCallModalOpen);
  }

  const toggleVideoCallModal = () => {
    setIsVideoCallModalOpen(!isVideoCallModalOpen);
  }



  return (
    < ChatTabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tabData,
        toggleContactModal,
        toggleGroupModal,
        isContactModalOpen,
        isGroupModalOpen,
        togglePhoneCallModal,
        toggleVideoCallModal,
        toggleAddContactToGroupModal,
        isAddContactToGroupModalOpen,
        isPhoneCallModalOpen,
        isVideoCallModalOpen,
        setIsDarkMode,
        isDarkMode
      }}
    >
      {children}
    </ ChatTabsContext.Provider>
  );
}