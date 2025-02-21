
import { ChatTabsContext } from "../../Context/chatTabs"
import { useContext } from "react"

const MenuIndex = () => {
  const {tabData, activeTab} = useContext(ChatTabsContext)
  return (
    <div  className=" pb-6 h-screen  bg-slate-100  hidden lg:block w-96  flex-none  dark:bg-gray-800 text-black dark:text-white  overflow-hidden text-dark-400  border-1 pt-4   ">
  
    <div className="bg-slate-100 p-3  dark:bg-gray-800 text-black dark:text-white  ">
        
     
     
        {tabData[activeTab].content}
      
    
      </div>
    </div>
  )
}

export default MenuIndex