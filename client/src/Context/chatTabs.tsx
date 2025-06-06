

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
   const [updateBioModal, setUpdateBioModal] = useState(false);
   const [updateProfileIMageModal, setUpdateProfileImageModal] = useState(false);
   const [messageIMageModal, setMessageImageModal] = useState(false);
   const [filesModal, setFilesModal] = useState(false);
   const [groupIMageModal, setGroupImageModal] = useState(false);
   const [groupFilesModal, setGroupFilesModal] = useState(false);
   const [updateLocationModal, setUpdateLocationModal] = useState(false);
   const [updateMobileModal, setUpdateMobileModal] = useState(false);
   
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
  const Tab3 = <i className='bx bx-message-square-dots bg-white text-gray-700  dark:bg-gray-800  dark:text-slate-500   bx-sm'></i>
  const Tab2 =<i className='bx bxs-user bg-white text-gray-700    dark:bg-gray-800  dark:text-slate-500    bx-sm'></i>
  const Tab4 = <i className='bx bx-group bx-sm bg-white text-gray-700  dark:bg-gray-800  dark:text-slate-500 ' ></i>
   const Tab5 = <i className='bx bxs-contact bx-sm bg-white text-gray-700  dark:bg-gray-800  dark:text-slate-500 ' ></i>
  const Tab6 = <i className='bx bx-cog bx-sm bg-white text-gray-700   dark:bg-gray-800  dark:text-slate-500 ' ></i>
  const Tab7 = <i className='bx bx-globe bx-sm bg-white text-gray-700   dark:bg-gray-800  dark:text-slate-500 '></i>

  
 
 

     const tabData = [
        // { label: Tab1, content: (<Homechat />) },
        { label: Tab3, content: (<ChatMenu  />),  content2: (<PrivateMessages />),  title:"Chats"},
        { label: Tab2, content: (<Profile />), content2: (<PrivateMessages />),  title:"Profile" },
        { label: Tab4, content: (<Groups />),   content2:(<GroupMessages />), title:"Groups"},
        { label: Tab5, content: (<Contact  />), content2: (<PrivateMessages />), title:"Contact", },
        { label: Tab6, content: ( <Settings />), content2: (<PrivateMessages />), title:"Settings" },
        { label: Tab7, content: (<Languages />), content2: (<PrivateMessages />), title:"Languages" },
        // { label: Tab8,  content2: (<PrivateMessages />), title:"Dark/Light Mode" },
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

  
  const toggleBioModal = () => {
    setUpdateBioModal(!updateBioModal);
  }
  const toggleProfileImageModal = () => {
    setUpdateProfileImageModal(!updateProfileIMageModal);
  }
  const toggleMessageImageModal = () => {
    setMessageImageModal(!messageIMageModal);
  }
  const toggleFilesModal = () => {
    setFilesModal(!filesModal);
  }
 
  const toggleGroupImageModal = () => {
    setGroupImageModal(!groupIMageModal);
  }
  const toggleGroupFilesModal = () => {
    setGroupFilesModal(!groupFilesModal);
  }

  const toggleMobileModal = () => {
    setUpdateMobileModal(!updateMobileModal);
  }
  const toggleLocationModal = () => {
    setUpdateLocationModal(!updateLocationModal);
  }


  return (
    < ChatTabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tabData,
        toggleContactModal,
        toggleGroupModal,
        toggleBioModal,
        toggleLocationModal,
        toggleMobileModal,
        toggleProfileImageModal,
        togglePhoneCallModal,
        toggleVideoCallModal,
        toggleAddContactToGroupModal,
        toggleFilesModal,
        toggleGroupImageModal,
        toggleGroupFilesModal,
        toggleMessageImageModal,
        messageIMageModal,
        filesModal,
        groupFilesModal,
        groupIMageModal,
        isContactModalOpen,
        isGroupModalOpen,
        isAddContactToGroupModalOpen,
        isPhoneCallModalOpen,
        isVideoCallModalOpen,
        updateBioModal,
        updateLocationModal,
        updateProfileIMageModal,
        updateMobileModal,
        setIsDarkMode,
        isDarkMode
      }}
    >
      {children}
    </ ChatTabsContext.Provider>
  );
}