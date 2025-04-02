
import { createContext, useEffect, useReducer, useRef, useState } from "react";
import io, {Socket}  from 'socket.io-client';
import { useAppDispatch, useAppSelector } from "../Redux/app/hook";
import { fetchAsyncUser, getAuthUser } from "../Redux/features/auth/authSlice";
// import { getPrivateMessages } from "../Redux/features/messages/messageSlice";
import { chatType , CONTACTS, GROUPS} from "../utils/types"
import {messageReducer, initialState} from "../Reducers/MessageReducers";

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext<chatType>(null!);

const SOCKET_SERVER_URL = import.meta.env.VITE_APP_BASE_URL


export const ChatProvider = ({ children}:{ children: React.ReactNode } ) => {
       const socket  = useRef<Socket | null | void>(null);
       socket.current = io(SOCKET_SERVER_URL);
    

 
    const reduxDispatch = useAppDispatch()
    const authUser = useAppSelector(getAuthUser)
    const [state, dispatch] = useReducer(messageReducer, initialState)
    const { messages, groupMessages, currentGroupMessage, currentMessage, currentFile, currentMedia, currentGroupFile, currentGroupMedia } = state;

  const [onlineUsers, setonlineUsers] = useState([]);
 const [receiver, setReceiver] = useState( () => {
  // Check if there is an existing count in localStorage
  const savedReceiver = localStorage.getItem("receiver");
  return savedReceiver ? JSON.parse(savedReceiver) : {};
})

const [group, setGroup] = useState( () => {
  // Check if there is an existing count in localStorage
  const savedGroup = localStorage.getItem("group");
  return savedGroup ? JSON.parse(savedGroup) : {};
})

// const [contactIndex, setContactIndex] = useState(0)
//  const [groupIndex, setGroupIndex] = useState(0)

    useEffect(() => {
      reduxDispatch(fetchAsyncUser)
  
}, [reduxDispatch]);


useEffect(() => {
  localStorage.setItem('receiver', JSON.stringify(receiver))

}, [ receiver]);

useEffect(() => {
  localStorage.setItem('group', JSON.stringify(group))

}, [group]);


//int-disable-next-line react-hooks/exhaustive-deps

   useEffect(() => {
     const sender_id = authUser?.id
     const receiver_id= receiver?.userid
      const data = {sender_id,receiver_id}
      if (socket.current){
        socket.current.emit('login', sender_id);
        socket.current.on('onlineUsers', (users) => {
            setonlineUsers(users);
        });
    
              // Fetch chat history
     socket.current.emit('requestChatHistory', data );
    socket.current.on('chatHistory', (results) => {
      //  setMessages(results);
      dispatch({ type: 'RECEIVE_MESSAGEHISTORY', payload: results });
    });

//Receive Message
    socket.current.on('private_message', (data) => {
          console.log(`received ${data}`)
          // setMessages((prevMessages) => [...prevMessages, data]);
          dispatch({type:'RECEIVE_MESSAGE', payload:data})
          
        });
      }
       
  
  
           

        return () => {
          if (socket.current){
            socket.current.off('private_message');
            // socket.off('private_media');
            // socket.off('private_files');
            socket.current.off('chatHistory');
            socket.current.off('onlineUsers');
          }
         
         ;
        };


}, [socket, authUser?.id, group, onlineUsers.length,  receiver, dispatch]);

console.log(currentGroupMessage, authUser, receiver)
useEffect(() => {

  const group_id = group?.id
if (socket.current){
  socket.current.emit('joinGroup', group_id);
     
  //  // Fetch chat history
    socket.current.emit('requestGroupChatHistory', group_id )
      socket.current.on('groupChatHistory', (results) => {
      //  setGroupMessages(results);
      dispatch({type:'RECEIVE_GROUPMESSAGE_HISTORY', payload:results})
     })
    
     //Fetch group message
       socket.current.on('group_message', (data) => {
     console.log(`group ${data}`)
    //  setGroupMessages((prevMessages) => [...prevMessages, data]);
    dispatch({type:'RECEIVE_GROUPMESSAGE', payload:data})
    });
    

}
          // Join the group chat room via Socket.IO
 
    
      // Cleanup listener when component unmountss
    
      return () => {
        if (socket.current){
          socket.current.off('group_message');
          socket.current.off('groupChatHistory');
        }
       
         
       };
}, [socket, authUser?.id, group,  receiver, dispatch]);

console.log(currentGroupMessage, currentGroupFile, currentGroupMedia)

const sendGroupMessage = (group:GROUPS) => {
 
  const message = currentGroupMessage
  const media = currentGroupMedia
  const files = currentGroupFile
if (socket.current){
  if (message !== "" ){
    const messageData ={  group_id: group?.id, user_id:authUser?.id, message:message}
    socket.current.emit('group_message', messageData);
    dispatch({type:"SEND_GROUPMESSAGE",  payload:{ sender_id: authUser?.id, message}})
    console.log(messageData)
    // setMessages([...messages, { sender_id: authUser.id, message }]);
  
  }

  if (media !== null ){
    const mediaData = {  group_id: group?.id, user_id:authUser?.id, media:media}
    socket.current.emit('group_media', mediaData);
    dispatch({type:"SEND_GROUPMESSAGE",  payload:{ sender_id: authUser?.id, media}})
    // setMessages([...messages, { sender_id: authUser.id, message }]);
    console.log(mediaData)
  }
  
  if (files !== null ){
    const fileData ={  group_id: group?.id, user_id:authUser?.id, files:files}
    socket.current.emit('group_files', fileData );
    dispatch({type:"SEND_GROUPMESSAGE",  payload:{ sender_id: authUser?.id, files}})
    console.log(fileData)
  }
}
  
 
      };
    


// Sending a private message
console.log(currentMessage)
console.log(currentGroupMessage)
console.log(currentMedia)
console.log(currentFile)
const sendPrivateMessage = (receiver:CONTACTS) => {

  const message = currentMessage
  const media = currentMedia
  const files = currentFile
  if (socket.current){
    if (message !== "" ){
      const messageData ={  sender_id: authUser?.id, receiver_id:receiver.userid, message:message}
     
      socket.current.emit('private_message', messageData);
      dispatch({type:"SEND_MESSAGE",  payload:{ sender_id: authUser?.id, message}})
      // setMessages([...messages, { sender_id: authUser.id, message }]);
    
    }
  
    if (media !== null ){
      const mediaData = {  sender_id: authUser?.id, receiver_id:receiver.userid, media:media}
      socket.current.emit('private_media', mediaData);
      dispatch({type:"SEND_MESSAGE",  payload:{ sender_id: authUser?.id, media}})
      // setMessages([...messages, { sender_id: authUser.id, message }]);
    
    }
  
  
    if (files !== null ){
      const fileData ={  sender_id: authUser?.id, receiver_id:receiver.userid, files:files}
      socket.current.emit('private_files', fileData );
      dispatch({type:"SEND_MESSAGE",  payload:{ sender_id: authUser?.id, files}})
      
    }
   
    
  
  
  
  }

 
 

}



  return (
    <ChatContext.Provider
      value={{
        sendPrivateMessage,
        sendGroupMessage,
        receiver,
        setReceiver,
        group,
        setGroup,
        state,
        dispatch,
        groupMessages,
        currentGroupMessage,
        messages,
        currentMessage,
        currentFile,
        currentMedia,
        currentGroupFile,
        currentGroupMedia,
        socket
      
       
    
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}