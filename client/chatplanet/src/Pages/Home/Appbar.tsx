/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { fetchAsyncUser, getAuthUser, getIsAuthenticated } from "../../Redux/features/auth/authSlice"
import {useEffect,  useContext } from "react"
 import { useAppSelector, useAppDispatch } from "../../Redux/app/hook";

 import { handleLogout } from "../../Redux/features/auth/authSlice";
import { ChatTabsContext } from "../../Context/chatTabs";

const Appbar = () => {
    const dispatch = useAppDispatch()
    const authUser = useAppSelector(getAuthUser)
   const isAuthenticated = useAppSelector(getIsAuthenticated)
//   // const authUser = useAppSelector(getAuthUser)

  const {tabData,activeTab, setActiveTab} = useContext(ChatTabsContext)

  
 useEffect(() => {
    
   dispatch(fetchAsyncUser());

 }, [dispatch])

  return (
<div className=" flex-none hidden lg:block h-screen   bg-slate-50 " >
  
<div className="flex">
      {/* Vertical Tab List */}
       {/* Tab headers */}
      <div className="w-4/4 bg-gray-100 p-4 my-4 space-y-5 rounded-lg">
       
       
        
   
        
        {tabData.map((tab:unknown, index:number) => (
          <div className='relative group'>
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`block w-full py-2 px-4 text-left text-sm font-semibold rounded-lg ${
              activeTab === index
                ? "bg-purple-400 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
           <div class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-sm rounded px-2 py-1">
           {tab.title}
         </div>
         </div>
        ))}
      </div>
</div>
    
   <div className="text-gray-500 p-6"><button type="button" className="tab active-tab:tab-active active" id="tabs-vertical-item-1" data-tab="#tabs-vertical-9" aria-controls="tabs-vertical-8" role="tab" aria-selected="true"> {authUser && isAuthenticated ? (<span onClick={() =>{ dispatch(handleLogout())}}> {authUser.firstname.toUpperCase()}</span>) : (<i  className='bx bx-log-in bx-sm'></i>)}</button></div> 
</div>
  )
}

export default Appbar