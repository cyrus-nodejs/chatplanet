/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { createContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import { useAppDispatch, useAppSelector } from "../Redux/app/hook";
import { fetchAsyncUser, getAuthUser } from "../Redux/features/auth/authSlice";
// import { getPrivateMessages } from "../Redux/features/messages/messageSlice";
import { chatType , CONTACTS, GROUPS} from "../utils/types"


// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext<chatType>(null!);

const SOCKET_SERVER_URL = import.meta.env.VITE_APP_BASE_URL


export const ChatProvider = ({ children}:{ children: React.ReactNode } ) => {
  const socket = io(SOCKET_SERVER_URL)
    const dispatch = useAppDispatch()
    // const privateMessages = useAppSelector(getPrivateMessages)
    const authUser = useAppSelector(getAuthUser)
 
  const [message, setMessage] = useState('');
  const [groupMessage, setGroupMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);

  const [onlineUsers, setonlineUsers] = useState([]);

const [receiver, setReceiver] = useState({})
const [group, setGroup] = useState({})
const [contactIndex, setContactIndex] = useState(0)
const [groupIndex, setGroupIndex] = useState(0)

    useEffect(() => {
      dispatch(fetchAsyncUser)
  
}, [dispatch]);


console.log(groupMessage)
   useEffect(() => {
     const sender_id = authUser?.id
     const receiver_id= receiver?.userid

     const data = {sender_id,receiver_id}

        socket.emit('login', sender_id);
     
        socket.on('onlineUsers', (users) => {
            setonlineUsers(users);
        });
    
        for (let i = 0; i < onlineUsers.length ; i++){
           if (onlineUsers?.id === receiver?.userid){
            setReceiver(receiver)
           }
        }

       

             // Fetch chat history
              socket.emit('requestChatHistory', data );
             
          
    socket.on('chatHistory', (results) => {
       setMessages(results);
    });

    socket.on('private_message', (data) => {
          console.log(`received ${data}`)
          setMessages((prevMessages) => [...prevMessages, data]);
          
        });
             // Join the group chat room via Socket.IO

        return () => {
          socket.off('private_message');
          // socket.emit('leaveGroup', group_id);
        };


}, [socket, authUser?.id, group, setMessages, onlineUsers.length, onlineUsers?.id, receiver]);


useEffect(() => {

  const group_id = group?.id

          // Join the group chat room via Socket.IO
 socket.emit('joinGroup', group_id);
     
     socket.emit('requestGroupChatHistory', group_id );
         
       socket.on('groupChatHistory', (results) => {
        setGroupMessages(results);
      })
      
         socket.on('group_message', (data) => {
       console.log(`group ${data}`)
       setGroupMessages((prevMessages) => [...prevMessages, data]);
      });
      // Cleanup listener when component unmountss
     return () => {
       socket.emit('leaveGroup', group_id);
     };


}, [socket, authUser?.id, group, setMessages, onlineUsers.length, onlineUsers?.id, receiver]);


const sendGroupMessage = (group:GROUPS) => {
        const group_id = group?.id
        const sender_id = authUser?.id
        const data = {  sender_id, groupMessage, group_id }
        console.log(`sendgroupdata : ${data}`)
        socket.emit('group_message', data);
      };
    


// Sending a private message

const sendPrivateMessage = (receiver:CONTACTS) => {
  const receiver_id = receiver.userid
  const sender_id = authUser?.id
  const data = {  receiver_id, message, sender_id }
  socket.emit('private_message', data);
  // setMessages([...messages, { sender_id: authUser.id, message }]);
}


  return (
    <ChatContext.Provider
      value={{
        message,
        messages,
        setMessage,
        setMessages,
        sendPrivateMessage,
        sendGroupMessage,
        onlineUsers,
        receiver,
        setReceiver,
        setGroup,
        group,
       groupIndex,
       setGroupIndex,
       contactIndex,
       setContactIndex,
       groupMessages,
       setGroupMessages,
       groupMessage,
        setGroupMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}