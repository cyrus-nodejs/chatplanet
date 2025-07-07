
import { useEffect, useState, useContext, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux/app/hook'
import { convertTimestampToTime, capitalizeFirstLetter } from '../../../utils/helper';
import EmojiPicker from '../../../components/Emoji/emoji';
import { ChatContext } from '../../../Context/chatContext'
import { ChatTabsContext } from '../../../Context/chatTabs'
import { getAllUsers, fetchAllUsers,  fetchAsyncUser, getAuthUser  } from '../../../Redux/features/auth/authSlice'
import { GROUPCHATMESSAGES} from '../../../utils/types'


//  import { getOnlineUsers, fetchOnlineUsers } from '../../../Redux/features/auth/authSlice'
const GroupMessages = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {  group,  dispatch,  groupMessages, currentGroupMessage,  sendGroupMessage } = useContext(ChatContext)
   const {togglePhoneCallModal, toggleVideoCallModal} = useContext(ChatTabsContext)

   const reduxDispatch = useAppDispatch()
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const authUser = useAppSelector(getAuthUser)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [showImage, setShowImage] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [error, setError] = useState('');

console.log(group)


   const allusers = useAppSelector(getAllUsers)
   
   const groupUser = (data:string|undefined) => {
   const user = allusers.filter(user =>  user.id  == data)
   return user
   }

   
   const handleEmojiSelect = (emoji:string ) => {
    dispatch({ type: 'SET_CURRENTGROUP_MESSAGE', payload:  currentGroupMessage + emoji})
    setShowEmojiPicker(false);
  };


  
  const handleFileToggle = () => {
    setShowFile(!showFile);
  };

  const handleImageToggle = () => {
    setShowImage(!showImage);
  };


  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageChange = (e: any) => {
    const file =  e.target.files[0] 
    if (file) {
      setError('');
       // Validate file type
       const validFileTypes = ['image/jpeg', 'image/png', 'image/avif', 'image/jpg', ];
       if (!validFileTypes.includes(file.type)) {
         setError('Invalid file type. Please upload a JPEG or PNG image.');
         setImagePreview(null);
         return;
       }
 
       // Validate file size (max 5MB)
       const maxSize = 5 * 1024 * 1024; // 5MB in bytes
       if (file.size > maxSize) {
         setError('File is too large. Please upload a file smaller than 5MB.');
         setImagePreview(null);
         return;
       }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        const base64Image  = reader.result as string
        dispatch({ type: 'SET_CURRENTGROUP_MEDIA', payload: { image: base64Image }})
      }
      reader.readAsDataURL(file);
    }
 
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (e: any) => {
    
    const file =  e.target.files[0] 
    if (file) {
      setError('');

      // Validate file type for .doc and .docx
      const validFileTypes = [  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validFileTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a .doc or .docx file.');
        setFilePreview(null);
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setError('File is too large. Please upload a file smaller than 10MB.');
        setFilePreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        const base64File  = reader.result as string
        dispatch({ type: 'SET_CURRENTGROUP_MEDIA', payload: { Files: base64File }})
      }
      // reader.readAsText(file);
      reader.readAsDataURL(file);
   
    }
 
  };
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [groupMessages]);


    
     useEffect(() => {
    
      reduxDispatch(fetchAllUsers());
    
     }, [reduxDispatch])
    

    useEffect(() => {
    
        reduxDispatch(fetchAsyncUser());
      
      }, [reduxDispatch])
      
  console.log(group)
  return (
    <section>  
      

  <div className='flex bg-white flex-col h-screen '>

    <div className="flex sticky  bg-white   dark:bg-gray-800 text-black dark:text-white  z-10   top-0 flex-row ">
    <div className="basis-1/3">
    <div className="flex ">
    <div style={{ backgroundImage: `url(${group?.group_image})` }} className='basis-2/2'>
    <img width='70'  className='rounded-full border border-1' height='50' src={group?.group_image} />
    </div>
    <div className="flex-grow pt-4 text-1xl h-16 px-3">
  {group && (<h5 className='text-slate-500 font-medium'> {capitalizeFirstLetter(group?.name?.toLowerCase())}  </h5>) } 
      
    </div>
  
   
  </div>
    </div>
    <div className="basis-1/3" ></div>
    <div className="basis-1/3">
    <div className="flex flex-row ">
    <div className="basis-1/5 pt-3" ><i className='bx bx-search bx-sm text-slate-500 '></i></div>
    <div onClick={togglePhoneCallModal} className="basis-1/5 pt-3"><i className='bx bxs-phone bx-sm text-slate-500 ' ></i></div>
    <div  onClick={toggleVideoCallModal} className="basis-1/5 pt-3"><i className='bx bx-video bx-sm text-slate-500 '></i></div>
    <div className="basis-1/5"><i className='bx bx-user bx-sm pt-3 text-slate-500 ' ></i></div>
    <div className="basis-1/5"><i className='bx bx-dots-horizontal-rounded bx-sm pt-3 ' ></i></div>
      </div>
    </div>
  
  </div>
 <div className='flex-1 overflow-y-auto px-4 space-x-4 bg-gray-100  dark:bg-gray-700 '>

  {groupMessages && (<div className=''>
            {groupMessages.map((msg:GROUPCHATMESSAGES, ) => (
           
            
     
            <div
            className={`max-w-xs p-3 rounded-lg ${
              msg.user_id === authUser?.id
                ? 'ml-auto bg-slateBlue text-white rounded-br-none bubble-user '
                : 'mr-auto bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-white my-3 rounded-bl-none bubble-bot'
            }`}
          >
            <div>
            <p className='italic'>{msg.message}</p>
         
              <p><span className='text-xs font-light '><i className='bx bx-time'></i>{convertTimestampToTime(msg.timestamp)}</span></p>
             <p>{ msg.user_id  === authUser?.id ? ( "You" ): (groupUser( msg.user_id)[0].firstname)}</p>
          </div>
      
          </div>
        
           
                             ))} 
              <div ref={messagesEndRef} />
          </div>)}
      
      </div>
   </div>
      
  
   <div className='flex flex-row sticky  bg-slate-100  dark:bg-gray-900  bottom-0'>
         <div className='  basis-2/3 '> 
          <input value={currentGroupMessage} onChange={(e) => dispatch({ type: 'SET_CURRENTGROUP_MESSAGE', payload: e.target.value })}  className=" w-full h-10 rounded-md py-2 m-3 focus:outline-none  focus:ring-purple-600 focus:border-transparent focus: placeholder-gray-500   bg-gray-200 dark:bg-gray-700 dark:text-white" placeholder="Enter Message"/>
         </div>
        
          <div className='basis-1/3 '>
          {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
           <div className="flex flex-row"> 
         <div className='relative group m-2'>
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className=' text-4xl rounded-md'>😐</button> 
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">Emoji</div>
         </div>
    
         <div className='relative group m-2'  >  
          
          <label
          htmlFor="file-upload"
          className="cursor-pointer   bg-slateBlue text-white flex items-center justify-center rounded-md shadow-lg hover:bg-blue-600 transition duration-300 "
        >
            <i className='bx bx-file text-white  bx-md'></i>
        </label>
        {filePreview && (
        <div  className="absolute  bottom-full mb-2  group-hover:block  text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">
       
             {!showFile && 
            
             <div   onClick={handleFileToggle} className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold mb-4"> Document Viewer</h1>
      
      {/* PDF viewer using iframe */}
      <div className="mb-6">
        <iframe
          src={filePreview}
        
          className="w-full h-96 border-2 border-gray-300 rounded-md"
          title="Document Viewer"
        ></iframe>
      </div>

    
    </div>
              }
      
        </div>
      )} 
 
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange} 
          className="hidden text-white"
          accept="application/pdf"
        />

      {error && <div style={{ color: 'red' }}>{error}</div>}
   {/* {fileName &&   <i onClick={handleFileUpload} className='bx bx-send bx-md'></i>  }   */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">Attach File</div>
         </div>
  <div className='relative group m-2'>
  
     <label
        htmlFor="image-upload"
        className="cursor-pointer   bg-slateBlue text-white flex items-center justify-center rounded-md shadow-lg hover:bg-blue-600 transition duration-300"
      >
          <i className='bx bx-image bx-md text-white'></i>
        <input
          type="file"
          id="image-upload"
          onChange={handleImageChange} 
          className="hidden"
          name='image'
             accept=".png, .jpg, .jpeg, avif"
          
        />

      {error && <div style={{ color: 'red' }}>{error}</div>}
      </label>

       {imagePreview && (
  
        <div onClick={handleImageToggle} className="absolute  bottom-full mb-2  group-hover:block  text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">
            {!showImage &&   <div className='h-32 w-32'> <img height='150'  width='150' src={imagePreview} className=" w-full h-full" /> </div>}
        
        </div>


      )} 
       {/* {image &&   <i onClick={handleImageUpload} className='bx bxs-send text-violet-400 bx-md'></i>  }    */}
     <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">Image</div>
     </div>
  <div className='relative group m-2'>    
    {authUser && (<button className='  rounded-md' type='submit' onClick={() => sendGroupMessage()}><i className='bx bx-play text-white  bg-slateBlue bx-md' ></i></button>)}
    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">Send </div>
    </div>
  </div>
    </div>
   

  
  
      
      
 
      
  </div>

  </section>
  )
}

export default GroupMessages