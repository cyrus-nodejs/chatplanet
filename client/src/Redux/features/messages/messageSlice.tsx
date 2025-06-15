import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'
import {  CHATMESSAGES, CONTACTS, USER} from '../../../utils/types'
import { RootState } from '../../app/store'
import axios from 'axios'



export interface messageState {
    privatemessages: CHATMESSAGES[] 
    recentusers:USER[] 
    groupmessages:CHATMESSAGES[] 
    message:string,
    status:  'idle' | 'pending' | 'succeeded' | 'failed'
    error:string | null | undefined
  }

  // Define the initial value for the slice state
const initialState: messageState = {
   privatemessages: [],
   recentusers:[] ,
   groupmessages:[],
   status: 'idle' ,
   message:"",
   error:null,
  
  }
  

// eslint-disable-next-line react-refresh/only-export-components
const BASEURL = import.meta.env.VITE_APP_BASE_URL
console.log(BASEURL)


    

         // Get recent chat
          export const fetchRecentChat = createAsyncThunk(
            'message/fetchRecentChat ',  async () => {
                const response= await axios.get(`${BASEURL}/get/recentchat`,{ withCredentials: true })
                console.log(response.data)
                return response.data
              });
              
              // Add recent chat
              export const fetchAddRecentChat = createAsyncThunk(
                'message/fetchAddRecentChat',  async (data:{receiver:CONTACTS}) => {
                  const {receiver} = data
                  const receiver_id = receiver.contactid
                    console.log(data)
                    const response= await axios.post(`${BASEURL}/add/recentchat`, {receiver_id},{ withCredentials: true })
                    console.log(response.data)
                    return response.data
                  });
    
             
             
            

     
         
// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const messageSlice = createSlice({
  name: 'message',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },
   extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
  
        builder.addCase(fetchRecentChat.pending, (state) => {
          state.status = 'pending'
        })
        .addCase(fetchRecentChat.fulfilled, (state, action) => {
             state.recentusers= action.payload.recentchat
             state.message= action.payload.message
         
          })
          .addCase(fetchRecentChat.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
          })
          
        .addCase(fetchAddRecentChat.pending, (state) => {
          state.status = 'pending'
          })
          .addCase(fetchAddRecentChat.fulfilled, (state) => {
            state.status = 'succeeded'
            
          })
          .addCase(fetchAddRecentChat.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
          })
   
    
  },
})


export const getPrivateMessages =(state:RootState) => state.message.privatemessages
export const getGroupMessages = (state:RootState) => state.message.groupmessages
export const getRecentUser = (state:RootState) => state.message.recentusers


export default messageSlice.reducer;