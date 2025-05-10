/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchAsyncUser, fetchAsyncLogout, getAuthUser, getIsAuthenticated } from "../../Redux/features/auth/authSlice"
import {useEffect,  useContext } from "react"
 import { useAppSelector, useAppDispatch } from "../../Redux/app/hook";

import { ChatTabsContext } from "../../Context/chatTabs";

const Appbar = () => {
    const dispatch = useAppDispatch()
    const authUser = useAppSelector(getAuthUser)
   const isAuthenticated = useAppSelector(getIsAuthenticated)
//   // const authUser = useAppSelector(getAuthUser)

  const {tabData, activeTab, setIsDarkMode, isDarkMode,  setActiveTab} = useContext(ChatTabsContext)

  
 useEffect(() => {
    
   dispatch(fetchAsyncUser());

 }, [dispatch])

  return (
<div className=" flex-none hidden lg:block h-screen    bg-slate-50  dark:bg-gray-800 text-black dark:text-white" >
  
<div className="flex">
    
      <div className="w-4/4  p-4 my-4 space-y-5 rounded-lg">
       
       
        
   
        
     
        {tabData.map((tab:any, index:number) => (
          <div className='relative group'>
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`block w-full py-2 px-4 text-left text-sm font-semibold rounded-lg ${
              activeTab === index
                ? "bg-violet-600  text-white "
                : " hover:bg-gray-200   "
            }`}
          >
            {tab.label}
          </button>
           <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">
           {tab.title}
         </div>
         </div>
        ))}
      </div>
</div>
<div className="w-4/4 relative group space-y-5 py-2 rounded-lg text-center"><button
  onClick={() => setIsDarkMode(!isDarkMode)}
  className="rounded-full"
>
   {isDarkMode ? <i className='bx bx-sun bx-sm text-inherit text-slate-500 dark:bg-gray-800  dark:text-slate-500 '></i> : <i className='bx bx-moon bx-sm text-slate-500' ></i>} 
</button>
<div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">
           Dark/Light Mode
         </div>
</div> 
   <div className="w-4/4 space-y-5 my-5 rounded-lg text-center"><button  type="button" className="tab active-tab:tab-active active" id="tabs-vertical-item-1" data-tab="#tabs-vertical-9" aria-controls="tabs-vertical-8" role="tab" aria-selected="true"> {authUser && isAuthenticated ? (<span className='text-slate-500' onClick={() => dispatch(fetchAsyncLogout())}> Logout</span>) : (<i  className='bx bx-log-in bx-sm'></i>)}</button></div> 
   
   
</div>
  )
}

export default Appbar