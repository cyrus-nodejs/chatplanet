import { useEffect,  useContext} from 'react'
import { CHATMESSAGES, } from '../../../../utils/types'
import { useAppDispatch, useAppSelector } from '../../../../Redux/app/hook'


import { getAllUsers, fetchAllUsers,getAuthUser, fetchAsyncUser } from '../../../../Redux/features/auth/authSlice'
// import { getPrivateMessages } from '../../../Redux/features/messages/messageSlice'
import { convertTimestampToTime , capitalizeFirstLetter} from '../../../../utils/helper'
import EmojiPicker from '../../../../components/Emoji/emoji';
import { ChatContext } from '../../../../Context/chatContext'
import { ChatTabsContext } from '../../../../Context/chatTabs'
import { useState } from 'react';

import { useRef } from 'react';


const PrivateMessages = () => {
    const {  currentTyping,  receiver, dispatch, messages, currentMessage,  sendPrivateMessage } = useContext(ChatContext)

  console.log(currentTyping)
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const {togglePhoneCallModal, toggleVideoCallModal} = useContext(ChatTabsContext)
    const reduxDispatch = useAppDispatch()
    // const messages = useAppSelector(getPrivateMessages)
    const authUser = useAppSelector(getAuthUser)
    const allusers = useAppSelector(getAllUsers)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [showImage, setShowImage] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [error, setError] = useState('');


    // const myuser  = allusers?.filter(users=> users.id ===receiver?.userid)

  
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

const handleEmojiSelect = (emoji:string ) => {
    dispatch({ type: 'SET_CURRENTMESSAGE', payload:  currentMessage + emoji})
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
        dispatch({ type: 'SET_CURRENTMEDIA', payload: { image: base64Image }})
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
        dispatch({ type: 'SET_CURRENTFILE', payload: { Files: base64File }})
      }
      // reader.readAsText(file);
      reader.readAsDataURL(file);
   
    }
 
  };

console.log(authUser?.id)
console.log(receiver)

 console.log(allusers)
     useEffect(() => {
    
      reduxDispatch(fetchAllUsers());
    
     }, [reduxDispatch])
    

    useEffect(() => {
    
        reduxDispatch(fetchAsyncUser());
      
      }, [reduxDispatch])
     
   
  return (
    <section>
      <div className='flex bg-white flex-col h-screen '>

          <div className="flex sticky  bg-white   dark:bg-gray-800 text-black dark:text-white    top-0 flex-row ">
  
  <div className="basis-1/3">

  <div className="flex ">
  <div style={{ backgroundImage: `url(${receiver?.profile_image})` }} className="flex-none w-10 bg-cover bg-center    m-auto pt-5 h-10 bg-slate-200  dark:bg-gray-800 text-black dark:text-white rounded-full  flex"> </div>
  <div className="flex-grow  pt-4 text-1xl text-slate-500 font-medium h-16 px-3">{capitalizeFirstLetter(receiver?.firstname?.toLowerCase() )}</div>
</div>

  </div>

  <div className="basis-1/3" ></div>
 
  <div className="basis-1/3">
  
  <div className="flex flex-row ">

  <div className="basis-1/5 pt-3" ><i className='bx bx-search bx-sm text-slate-500 '></i></div>
  <div onClick={togglePhoneCallModal} className="basis-1/5 pt-3"><i className='bx bxs-phone bx-sm text-slate-500 ' ></i></div>
  <div  onClick={toggleVideoCallModal} className="basis-1/5 pt-3"><i className='bx bx-video bx-sm text-slate-500 '></i></div>
  <div className="basis-1/5"><i className='bx bx-user bx-sm pt-3 text-slate-500 ' ></i></div>
  <div className="basis-1/5"><i className='bx bx-dots-horizontal-rounded bx-sm pt-3 text-slate-500 ' ></i></div>
    
    </div>
  
  </div>

</div>


        <div className='flex-1 overflow-y-auto px-4 space-x-4 bg-gray-100  dark:bg-gray-700 '>

         {messages && (<div className=''>
           {messages?.map((msg:CHATMESSAGES) => (
          
            <div
            key={msg.timestamp}
            className={`max-w-xs p-3 rounded-lg ${
              msg.sender_id === authUser?.id
                ? 'ml-auto bg-slateBlue text-white my-2 rounded-br-none bubble-user  '
                : 'mr-auto bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-white my-2 rounded-bl-none bubble-bot'
            }`}
          >
            <div className='sm: w-40rem  md:48rem lg:64rem xl:80rem 2xl:96rem' >
            <p className='italic'>{msg.message}</p>
         
              <p><span className='text-xs font-light '><i className='bx bx-time'></i>{convertTimestampToTime(msg.timestamp)}</span></p>
             <p>{ msg.sender_id  === authUser?.id ? ( "Me" ):  capitalizeFirstLetter(receiver?.firstname)}</p>
          </div>
      
          </div>
          
          ))} 
               <div ref={messagesEndRef} />
         </div>)}
         </div>
</div>




  
  
      <div className='flex flex-row sticky  bg-slate-100  dark:bg-gray-900  bottom-0'>
          {currentTyping && "User is typing..."}
         <div className='  basis-2/3 '> 
          <input value={currentMessage} onChange={(e) =>{ dispatch({ type: 'SET_CURRENTMESSAGE', payload: e.target.value })}} className=" w-full h-10 rounded-md py-2 m-3 focus:outline-none  focus:ring-purple-600 focus:border-transparent focus: placeholder-gray-500   bg-gray-200" placeholder="Enter Message"/>
       
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
            
             <div   onClick={handleFileToggle} className="flex flex-col items-left ">
      <h1 className="text-2xl font-semibold mb-4"> Document Viewer</h1>
      
      {/* PDF viewer using iframe */}
      <div className="">
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
          className="hidden"
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
    {authUser && (<button className='  rounded-md' type='submit' onClick={() => sendPrivateMessage()}><i className='bx bx-play text-white  bg-slateBlue bx-md' ></i></button>)}
    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">Send </div>
    </div>
  </div>
    </div>
   

     </div>

  </section>
  )
}

export default PrivateMessages