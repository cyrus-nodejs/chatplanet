
import { createContext, useEffect, useReducer, useRef } from "react";
import io, {Socket}  from 'socket.io-client';
import {  useAppSelector } from "../Redux/app/hook";
import {  getAuthUser } from "../Redux/features/auth/authSlice";
// import { getPrivateMessages } from "../Redux/features/messages/messageSlice";
import { chatType } from "../utils/types"
import {messageReducer, initialState} from "../Reducers/MessageReducers";
import { formatTime } from "../utils/helper";
// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext<chatType>(null!);

const SOCKET_SERVER_URL = import.meta.env.VITE_APP_BASE_URL


export const ChatProvider = ({ children}:{ children: React.ReactNode } ) => {
  
const now = new Date();               // Current time (local time zone)
const iso:string = now.toISOString();       // "2025-06-13T14:20:00.000Z"
const date = new Date(iso);
  
const socket  = useRef<Socket | null | void>(null);
  socket.current = io(SOCKET_SERVER_URL, {
    withCredentials: true,
  transports: ["websocket"]
});
  

    const authUser = useAppSelector(getAuthUser)
   
    const [state, dispatch] = useReducer(messageReducer, initialState)
    const { messages, groupMessages, currentGroupMessage, currentMessage, currentTyping, currentGroupTyping, 
      currentFile, currentMedia, currentGroupFile, currentGroupMedia, receiver, onlineUsers, group } = state;


      useEffect(() => {
  localStorage.setItem('receiver', JSON.stringify(receiver))

}, [ receiver]);

useEffect(() => {
  localStorage.setItem('group', JSON.stringify(group))

}, [group]);



   useEffect(() => {
     const sender_id = authUser?.id
     const receiver_id = receiver?.contactid
      const data = {sender_id,receiver_id}
     
      if (socket.current){
        socket.current.emit('login', sender_id);
        socket.current.on('onlineUsers', (users) => {
           // setonlineUsers(users);
            dispatch({ type: 'SET_ONLINE_USERS', payload: users })
        });
    
              // Fetch chat history
     socket.current.emit('requestChatHistory', data );
    socket.current.on('chatHistory', (results) => {
      console.log('caht results', results)
      dispatch({ type: 'RECEIVE_MESSAGEHISTORY', payload: results });
    });

//Receive Message
    socket.current.on('private_message', ({messageData}) => {
          console.log(`received ${data}`)
          // setMessages((prevMessages) => [...prevMessages, data]);
          console.log('private message', data)
          dispatch({type:'RECEIVE_MESSAGE', payload:messageData})
          
        });
     
// isTyping
    socket.current.on('private_typing', ({ sender_id}) => {
    
          if ( sender_id === receiver_id){
     dispatch({type:'SET_CURRENT_TYPING', payload:true})
         }
       
             console.log('typing', sender_id)
        });
        
        // stopTyping
         socket.current.on('stop_private_typing', ({ sender_id}) => {

          console.log(`received ${data}`)
            if ( sender_id === receiver_id){
             dispatch({type:'SET_CURRENT_GROUPTYPING', payload:true})
         }
        });
      }
       
   
        return () => {
          if (socket.current){
            socket.current.off('private_message');
              socket.current.off('private_media');
              socket.current.off('private_files');
            socket.current.off('chatHistory');
            socket.current.off('onlineUsers');
          }
         
         ;
        };


}, [socket, authUser?.id, group, onlineUsers,   receiver, dispatch]);

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

console.log(currentGroupMessage, 
  currentGroupFile,
   currentGroupMedia)

const sendGroupMessage = ()  => {
 
  const message = currentGroupMessage
  const media = currentGroupMedia
  const files = currentGroupFile
if (socket.current){
  if (message !== ""  ){
    const messageData ={  group_id: group?.id, user_id:authUser?.id, message:message}
    socket.current.emit('group_message', messageData);
    dispatch({type:"SEND_GROUPMESSAGE",  payload:{group_id: group?.id, user_id: authUser?.id, message, media:media, files:files, timestamp:formatTime(date)}})
    console.log(messageData)
    // setMessages([...messages, { sender_id: authUser.id, message }]);
  
  }

  if ( media !== null ){
    const mediaData = {  group_id: group?.id, user_id:authUser?.id, media:media}
    socket.current.emit('group_media', mediaData);
    dispatch({type:"SEND_GROUPMESSAGE",  payload:{group_id: group?.id, user_id: authUser?.id, message, media:media, files:files, timestamp:'Now'}})
    // setMessages([...messages, { sender_id: authUser.id, message }]);
    console.log(mediaData)
  }
  
  if (files !== null ){
    const fileData ={  group_id: group?.id, user_id:authUser?.id, files:files}
    socket.current.emit('group_files', fileData );
    dispatch({type:"SEND_GROUPMESSAGE",  payload:{group_id: group?.id, user_id: authUser?.id, message, media:media, files:files, timestamp:formatTime(date)}})
    console.log(fileData)
  }
}
  
 
      };
 

const sendPrivateMessage = () => {

  const message = currentMessage
  const media = currentMedia
  const files = currentFile
  if (socket.current){
    if (message !== ""   ){
      const messageData ={  sender_id: authUser?.id, receiver_id:receiver.contactid, message:message}
     console.log(receiver)
      socket.current.emit('private_message', messageData);
      dispatch({type:"SEND_MESSAGE",  payload:{ sender_id: authUser?.id,receiver_id:receiver.contactid, message:message, media:media, files:files, timestamp:formatTime(date), type:"text", status:'delivered' }})
      console.log(messageData)
    
    }
  
    if (media !== null ){
      const mediaData = {  sender_id: authUser?.id, receiver_id:receiver.contactid, media:media}
      socket.current.emit('private_media', mediaData);
      dispatch({type:"SEND_MESSAGE",  payload:{ sender_id: authUser?.id,receiver_id:receiver.contactid, message:message, media:media, files:files, timestamp:formatTime(date), type:"media", status:'delivered' }})
      // setMessages([...messages, { sender_id: authUser.id, message }]);
    
    }
  
  
    if (files !== null ){
      const fileData ={  sender_id: authUser?.id, receiver_id:receiver.contactid, files:files}
      socket.current.emit('private_files', fileData );
      dispatch({type:"SEND_MESSAGE",  payload:{ sender_id: authUser?.id,receiver_id:receiver.contactid, message:message, media:media, files:files, timestamp:formatTime(date), type:"files", status:'delivered' }})
      
    }
   
    
  
  
  
  }

 
 

}



  return (
    <ChatContext.Provider
      value={{
        sendPrivateMessage,
        sendGroupMessage,
        receiver,
        group,
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
        socket,
        currentTyping,
        currentGroupTyping,
      

      
       
    
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}