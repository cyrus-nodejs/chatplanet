
 import {   useEffect } from "react"
import { USER } from "../../utils/types"
  import { getOnlineUsers, fetchOnlineUsers } from "../../Redux/features/auth/authSlice"
 import {useAppSelector,  useAppDispatch } from "../../Redux/app/hook"

 import { fetchAsyncUser } from "../../Redux/features/auth/authSlice"
const ChatMenu = () => {
 
  const dispatch = useAppDispatch()
 const onlineusers = useAppSelector(getOnlineUsers)

 useEffect(() => {
  dispatch(fetchOnlineUsers());
}, [dispatch])

useEffect(() => {
  dispatch(fetchAsyncUser());
}, [dispatch])

  return (
    <div id="tabs-vertical-3" className='' role="tabpanel" aria-labelledby="tabs-vertical-item-3">
      <p className="text-left font-mono text-2xl text-black-400">Chats</p>
      
      <div className=' flex mt-4 rounded'><input className="w-full h-10 border border-transparent rounded focus:outline-none  focus:ring-purple-600 focus:border-transparent focus: placeholder-gray-500   bg-gray-200" placeholder="Search messages or users"/></div>
     
      
      {onlineusers && (<div className="flex   flex-row ">
  {onlineusers.map((user:USER, id:number) =>{
          return (
            <div>
        <div  key={id} className=" w-24 relative pt-5 h-24 bg-purple-400 text-white  m-3 rounded-full">{user.firstname.toUpperCase()} {user.lastname.toUpperCase()} </div>
              {user.status && (<div className=' absolute inset-x-0 bottom-0  h-2 w-2 rounded-full bg-green-500'></div>)} 
              </div>
              )
       })}
</div>)}
 

     
      <p className="text-left font-mono text-2xl text-black-400">Recent</p>

      <div className="flex ">
  <div className="flex-none w-16 h-16  bg-slate-200 rounded-full  flex">
     This item will not grow 
  </div>
  <div className="flex-grow h-16 px-3">
    About
  </div>
  <div className="flex-none w-16 h-16 ...">
  Time
  </div>
</div>
      </div>
  )
}

export default ChatMenu