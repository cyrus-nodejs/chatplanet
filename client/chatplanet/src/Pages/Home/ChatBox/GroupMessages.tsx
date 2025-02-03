/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useEffect,  useContext } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux/app/hook'
import { fetchAsyncUser, getAuthUser } from '../../../Redux/features/auth/authSlice'
import { fetchGroupMembers } from '../../../Redux/features/groups/groupSlice'
import { ChatContext } from '../../../Context/chatContext'
import { ChatTabsContext } from '../../../Context/chatTabs'

//  import { getOnlineUsers, fetchOnlineUsers } from '../../../Redux/features/auth/authSlice'
const GroupMessages = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let data;
  
    const {  group,   groupMessages, groupMessage, setGroupMessage,  sendGroupMessage } = useContext(ChatContext)
   const {togglePhoneCallModal, toggleVideoCallModal} = useContext(ChatTabsContext)

   const dispatch = useAppDispatch()
   
    const authUser = useAppSelector(getAuthUser)
    //  const onlineusers= useAppSelector(getOnlineUsers)
  // const groupmembers = useAppSelector(getGroupMembers)
// const getPerson = (id: string | undefined) => {
//   onlineusers.find(obj => obj.id === id)
// }
 

 

console.log(groupMessage)
console.log(groupMessages)
    useEffect(() => {
    
      dispatch(fetchGroupMembers(group));
    
    }, [dispatch, group])
    
    // useEffect(() => {
    
    //   dispatch(fetchOnlineUsers());
    
    // }, [dispatch, ])
    

    useEffect(() => {
    
        dispatch(fetchAsyncUser());
      
      }, [dispatch])
      
  
  return (
    <section>  
        <div className="flex sticky     top-0 flex-row ">
    <div className="basis-1/3">
    <div className="flex ">
    <div className="flex-none w-10 pt-5 h-10 bg-slate-200 rounded-full  flex">
    <img className='rounded-full' src="https://img.freepik.com/premium-photo/ai-generated-images-build-user-profile-page_1290175-101.jpg" alt="avatar " />
    </div>
    <div className="flex-grow pt-4 text-1xl h-16 px-3">
  {group && (<strong> {group?.name?.toUpperCase()} Group </strong>) } 
      
    </div>
  
   
  </div>
    </div>
    <div className="basis-1/3" ></div>
    <div className="basis-1/3">
    <div className="flex flex-row ">
    <div className="basis-1/5" ><i className='bx bx-search bx-sm'></i></div>
    <div onClick={togglePhoneCallModal} className="basis-1/5"><i className='bx bxs-phone bx-sm' ></i></div>
    <div  onClick={toggleVideoCallModal} className="basis-1/5"><i className='bx bx-video bx-sm'></i></div>
    <div className="basis-1/5"><i className='bx bx-user bx-sm' ></i></div>
    <div className="basis-1/5"><i className='bx bx-dots-horizontal-rounded bx-sm' ></i></div>
      </div>
    </div>
  
  </div>

    <div className='chat-box relative  rounded-lg shadow-lg overflow-hidden'>
    <div className={`max-h-screen flex-1 px-4 py-4 overflow-y-auto space-y-4 `}>
      {groupMessages && (<div>
        {groupMessages.map((msg, index) => (
        <div key={index} className="">
        <div className="rounded-bl-lg m-3 text-lg h-20 bg-violet-300 text-base-content/90" >
        <strong>{
            msg.sender_id === authUser?.id ? (authUser?.firstname) :
        //  msg.sender_id === getPerson(msg.sender_id).id ? (getPerson(msg.sender_id).firstname):
            ""
        
        }:</strong> {msg.message}
        </div>
      </div>
                         ))} 
      </div>)}
      </div>
   
      
  
  <div className="flex w-4/6  mt-3 fixed bottom-0 ">
  
    <div className=" flex-grow p-3 "><input value={groupMessage} onChange={(e) => setGroupMessage(e.target.value)}  className="w-full h-10 border border-transparent rounded focus:outline-none  focus:ring-purple-600 focus:border-transparent focus: placeholder-gray-500   bg-gray-200" placeholder="Enter Message"/></div>
   
    
    <div className="grid grid-flow-col pt-4 auto-rows-max w-64">
    <div  className='p-2'>😐</div>
    <div  className='p-2'><i className='bx bx-file bx-sm'></i></div>
    <div className='p-2'><i className='bx bx-image bx-sm'></i></div>
    <div>{authUser && (<button onClick={() => sendGroupMessage(group)}><i className='bx bx-play text-white   bg-purple-400 bx-md' ></i></button>)}</div>
    </div>
  
      </div>
  </div>
  </section>
  )
}

export default GroupMessages