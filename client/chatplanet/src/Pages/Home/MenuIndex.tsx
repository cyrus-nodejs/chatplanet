
import { ChatTabsContext } from "../../Context/chatTabs"
import { useContext } from "react"

const MenuIndex = () => {
  const {tabData, activeTab} = useContext(ChatTabsContext)
  return (
    <div className="bg-slate-100 p-3  hidden lg:block w-96  flex-none ">
        
     
     
        {tabData[activeTab].content}
      
    
      
    </div>
  )
}

export default MenuIndex