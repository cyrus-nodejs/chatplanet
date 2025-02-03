import {  useEffect, useContext } from 'react'
import { useAppDispatch, } from '../../Redux/app/hook'
import { fetchAsyncUser,  } from '../../Redux/features/auth/authSlice'



import { ChatTabsContext } from '../../Context/chatTabs'

const ChatBox = () => {
  

  const { tabData, activeTab}  = useContext(ChatTabsContext)
  const dispatch = useAppDispatch()
  // const authUser = useAppSelector(getAuthUser)
 




 useEffect(() => {
    
  dispatch(fetchAsyncUser());

}, [dispatch, ])




  return (
    <div  className=" w-full h-screen flex-initial   overflow-hidden text-dark-400  border-4 pt-4  bg-slate-50 ">
  
    <div className='relative  '>
    {tabData[activeTab].content2}
</div>
    </div>
  )
}

export default ChatBox