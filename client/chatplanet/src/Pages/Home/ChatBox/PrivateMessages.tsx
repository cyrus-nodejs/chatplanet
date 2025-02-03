import { useEffect,  useContext } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux/app/hook'
import { fetchAsyncUser, getAuthUser } from '../../../Redux/features/auth/authSlice'
// import { getPrivateMessages } from '../../../Redux/features/messages/messageSlice'
import { ChatContext } from '../../../Context/chatContext'
import { ChatTabsContext } from '../../../Context/chatTabs'
const PrivateMessages = () => {
    const {   receiver, messages, message, setMessage,   sendPrivateMessage } = useContext(ChatContext)
   const {togglePhoneCallModal, toggleVideoCallModal} = useContext(ChatTabsContext)
    const dispatch = useAppDispatch()
    // const messages = useAppSelector(getPrivateMessages)
    const authUser = useAppSelector(getAuthUser)
    // const [isCollapsed, setIsCollapsed] = useState(true);

    // const toggleCollapse = () => {
    //   setIsCollapsed(prevState => !prevState);
    // };
    console.log(messages)
    useEffect(() => {
    
        dispatch(fetchAsyncUser());
      
      }, [dispatch, ])
      
      
  return (
    <section>
          <div className="flex sticky     top-0 flex-row ">
  <div className="basis-1/3">
  <div className="flex ">
  <div className="flex-none w-10 pt-5 h-10 bg-slate-200 rounded-full  flex">
  <img className='rounded-full' src="https://img.freepik.com/premium-photo/ai-generated-images-build-user-profile-page_1290175-101.jpg" alt="avatar " />
  </div>
  <div className="flex-grow pt-4 text-1xl h-16 px-3">
 {receiver?.firstname?.toUpperCase() }
    
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
    <div className='chat-box   rounded-lg shadow-lg overflow-hidden'>
      
    <div  className={`max-h-screen flex-1 px-4 py-4 overflow-y-auto space-y-4 `}>
      {messages && (<div>
        {messages.map((msg, index) => (
        <div key={index} className="">
        <div className="rounded-bl-lg m-3 text-lg h-20 bg-violet-300 text-base-content/90" >
        <strong>{
        msg.sender_id === receiver.userid ? (receiver?.firstname) :
        msg.sender_id === authUser?.id ? (authUser?.firstname) :
        msg.receiver_id === authUser?.id ? (authUser?.firstname) :
         msg.receiver_id === receiver?.userid ?(receiver?.firstname):
        "unknown user"
    
       
      }:</strong> {msg.message}
        </div>
      </div>
                         ))} 
      </div>)}
      </div>
   
      
  
  <div className="flex w-4/6 p-4  bg-white mt-3 fixed bottom-0 ">
  
    <div className=" flex-grow p-3 "><input value={message} onChange={(e) => setMessage(e.target.value)}  className="w-full h-10 border border-transparent rounded focus:outline-none  focus:ring-purple-600 focus:border-transparent focus: placeholder-gray-500   bg-gray-200" placeholder="Enter Message"/></div>
   
    
    <div className="grid grid-flow-col pt-4 auto-rows-max w-64">
    <div  className='p-2'>😐</div>
    <div  className='p-2'><i className='bx bx-file bx-sm'></i></div>
    <div className='p-2'><i className='bx bx-image bx-sm'></i></div>
    <div>{authUser && (<button type='submit' onClick={() => sendPrivateMessage(receiver)}><i className='bx bx-play text-white   bg-purple-400 bx-md' ></i></button>)}</div>
    </div>
  
      </div>
  </div>
  </section>
  )
}

export default PrivateMessages