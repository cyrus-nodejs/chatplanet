/* eslint-disable @typescript-eslint/no-explicit-any */

 import {   useEffect } from "react"
import { USER } from "../../utils/types"
  import { getOnlineUsers, fetchOnlineUsers } from "../../Redux/features/auth/authSlice"
 import {useAppSelector,  useAppDispatch } from "../../Redux/app/hook"
import { getRecentUser, fetchRecentChat } from "../../Redux/features/messages/messageSlice"
 import { fetchAsyncUser } from "../../Redux/features/auth/authSlice"
import { convertTimestampToTime } from "../../utils/helper"

const ChatMenu = () => {
 
  const dispatch = useAppDispatch()
 const onlineusers = useAppSelector(getOnlineUsers)
 const recentChat = useAppSelector(getRecentUser)

 console.log(recentChat)
console.log(onlineusers)

// const recentusers = recentChat?.filter((value:any, index, self) => 
 
//   index === self.findIndex((t:any) => (
//     t?.receiver_id === value?.receiver_id
//   ))
// );

 useEffect(() => {
  dispatch(fetchOnlineUsers());
}, [dispatch])

useEffect(() => {
  dispatch(fetchAsyncUser());
}, [dispatch])

useEffect(() => {
  dispatch(fetchRecentChat());
}, [dispatch])
console.log(recentChat)
  return (
    <div id="tabs-vertical-3" className=' ' role="tabpanel" aria-labelledby="tabs-vertical-item-3">
      <p className="text-left font-mono text-2xl text-slate-500">Chats</p>
      
      <div className=' flex my-4 rounded'><input className="w-full h-10 border border-transparent rounded focus:outline-none  focus:ring-purple-600 focus:border-transparent focus: placeholder-gray-500   bg-gray-200" placeholder="Search messages or users"/></div>
     
      
      {onlineusers && (<div className="flex   flex-row ">
  {onlineusers.map((user:USER, id:number) =>{
          return (
    
        <div key={id} className="flex justify-center items-center">
        <div className="w-24 h-24 overflow-hidden rounded-full border-1">
          <img
            className="w-full h-full object-cover "
            src={user?.profile_image}
            alt="Rounded Image"
          />
        </div>
      </div>
              )
       })}
</div>)}
 

     
      <p className="text-left my-3 font-mono text-2xl text-slate-500">Recent Chat</p>

   <div className='h-64 overflow-hidden overflow-y-auto justify-between'>
      {recentChat && (  
         <div className=" ">
        
        
        {recentChat.map((data:any) => (
            
        
<div className='flex flex-col ' key={data.recentchat_id}>
  <div className='my-2 '>
    <div className="flex">
   <div className='basis-2/12' >{<img width='100'  className='rounded-full border border-1' height='100' src={data?.receiver_avatar} /> }</div>
  <div className="w-48 mx-1 flex-none ">
  <div className="flex flex-col text-sm ">
  <div className='font-medium text-slate-500'><span className=' text-slate-500'>{data?.receiver_name} {data.receiver_lastname}</span></div>
  <div className='text-slate-300'><span className='text-xs  text-slate-500'>{data?.latest_message} </span></div>
  
</div>
  </div>
  <div className="w-16 flex-none  mx-1 text-slate-500"><span className='text-xs  text-slate-500'>{convertTimestampToTime(data?.latest_message_time)} </span></div>
</div>
    </div>
 

  </div>



))}
</div>
      )
    }
      </div>
      </div>
  )
}

export default ChatMenu

