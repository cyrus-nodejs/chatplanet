import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'
import {    CONTACTS, GROUPS, GROUPMEMBERS } from '../../../utils/types'
import { RootState } from '../../app/store'
import axios from 'axios'

export interface groupState {
    groups: GROUPS[] 
    groupmembers: GROUPMEMBERS[]
    message:string,
    status:  'idle' | 'pending' | 'succeeded' | 'failed'
    error:string | null | undefined
  }

  // Define the initial value for the slice state
const initialState: groupState = {
   groups: [],
   groupmembers:[],
   status: 'idle' ,
   message:"",
   error:null,
  
  }
  

// eslint-disable-next-line react-refresh/only-export-components
const BASEURL = import.meta.env.VITE_APP_BASE_URL
console.log(BASEURL)

export const fetchAddGroup = createAsyncThunk(
    'contact/fetchAddGroup', async (data:{ name:string, description:string } ) => {
     const { name, description} = data

        const response= await axios.post(`${BASEURL}/creategroup`,{name,description,},{ withCredentials: true })
        console.log(response.data)
        return response.data
      });

      export const fetchAddGroupMembers = createAsyncThunk(
        'contact/fetchAddGroupMembers', async (data:{ group:GROUPS, contact:CONTACTS } ) => {
   console.log(data)
          const {group, contact} = data
       const group_id = group.id
       const user_id = contact.userid
      
            const response= await axios.post(`${BASEURL}/add/groupmembers`,{user_id, group_id},{ withCredentials: true })
            console.log(response.data)
            return response.data
          });
    
export const fetchGroups = createAsyncThunk(
    'contact/fetchGroups', async () => {
        const response= await axios.get(`${BASEURL}/getgroups`, { withCredentials: true })
        console.log(response.data)
        return response.data
      });

      export const fetchGroupMembers = createAsyncThunk(
        'contact/fetchGroupMembers', async (group:GROUPS) => {
          // const {group} = data
          const group_id = group?.id
          const response= await axios.get(`${BASEURL}/getgroupmembers/${group_id}`, { withCredentials: true })
            console.log(response.data)
            return response.data
          });
    
        
            

     
         
// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const groupSlice = createSlice({
  name: 'group',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },
   extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchGroups.pending, (state) => {
      state.status = 'pending'
      
    })
    .addCase(fetchGroups.fulfilled, (state, action) => {
         state.groups= action.payload.groups
         state.message= action.payload.message
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message;
        
      })
      builder.addCase(fetchGroupMembers.pending, (state) => {
        state.status = 'pending'
        
      })
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
           state.groupmembers= action.payload.groupmembers
           state.message= action.payload.message
        })
        .addCase(fetchGroupMembers.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message;
          
        })
     
      .addCase(fetchAddGroup.pending, (state) => {
        state.status = 'pending'
        })
        .addCase(fetchAddGroup.fulfilled, (state, action) => {
          state.message= action.payload.message
        })
        .addCase(fetchAddGroup.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message;
        })
        .addCase(fetchAddGroupMembers.pending, (state) => {
          state.status = 'pending'
          })
          .addCase(fetchAddGroupMembers.fulfilled, (state, action) => {
            state.message= action.payload.message
          })
          .addCase(fetchAddGroupMembers.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
          })
      
    
  },
})


export const getGroupMembers =(state:RootState) => state.group.groupmembers
export const getAllGroup =(state:RootState) => state.group.groups
export const getGroupMessage =(state:RootState) => state.group.message

// Export the slice reducer for use in the store configuration
export default groupSlice.reducer;