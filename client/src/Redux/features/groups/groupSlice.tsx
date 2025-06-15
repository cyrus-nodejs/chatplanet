import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'
import {    CONTACTS, GROUPS, GROUPMEMBERS } from '../../../utils/types'
import { RootState } from '../../app/store'
import axios from 'axios'

export interface groupState {
    groups: GROUPS[] 
    searchresults:GROUPS[]
    groupmembers: GROUPMEMBERS[]
    message:string,
    status:  'idle' | 'pending' | 'succeeded' | 'failed'
    error:string | null | undefined
  }

  // Define the initial value for the slice state
const initialState: groupState = {
   groups: [],
   searchresults:[],
   groupmembers:[],
   status: 'idle' ,
   message:"",
   error:null,
  
  }
  

// eslint-disable-next-line react-refresh/only-export-components
const BASEURL = import.meta.env.VITE_APP_BASE_URL
console.log(BASEURL)

// Add group to database
export const fetchAddGroup = createAsyncThunk(
    'group/fetchAddGroup', async (data:{ name:string, description:string } ) => {
     const { name, description} = data

        const response= await axios.post(`${BASEURL}/creategroup`,{name,description,},{ withCredentials: true })
        console.log(response.data)
        return response.data
      });

      // add members to group
      export const fetchAddGroupMembers = createAsyncThunk(
        'group/fetchAddGroupMembers', async (data:{ group:GROUPS, contact:CONTACTS } ) => {
   console.log(data)
          const {group, contact} = data
       const group_id = group.id
       const user_id = contact.contactid
      
            const response= await axios.post(`${BASEURL}/add/groupmembers`,{user_id, group_id},{ withCredentials: true })
            console.log(response.data)
            return response.data
          });
    
          //Get all groups
export const fetchGroups = createAsyncThunk(
    'group/fetchGroups', async () => {
        const response= await axios.get(`${BASEURL}/getgroups`, { withCredentials: true })
        console.log(response.data)
        return response.data
      });
       
      //Get members from group
      export const fetchGroupMembers = createAsyncThunk(
        'group/fetchGroupMembers', async () => {
          const response= await axios.get(`${BASEURL}/get/groupmembers`, { withCredentials: true })
            console.log(response.data)
            return response.data
          });
    
           //Get members from group
      export const fetchSearchGroup = createAsyncThunk(
        'group/fetchSearchGroup', async (data:{query:string}) => {
          const {query} = data
          const response= await axios.get(`${BASEURL}/search-contact?q=${query}`, { withCredentials: true })
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
      
            
                  .addCase(fetchSearchGroup.pending, (state) => {
                state.status = 'pending'
                
              })
              .addCase(fetchSearchGroup.fulfilled, (state, action) => {
                   state.searchresults= action.payload.searchresults
                   state.message= action.payload.message
                })
                .addCase(fetchSearchGroup.rejected, (state, action) => {
                  state.status = 'failed'
                  state.error = action.error.message;
                  
                })
    
  },
})


export const getGroupMembers =(state:RootState) => state.group.groupmembers
export const getAllGroup =(state:RootState) => state.group.groups
export const getGroupMessage =(state:RootState) => state.group.message
export const getSearchResults =(state:RootState) => state.group.searchresults

// Export the slice reducer for use in the store configuration
export default groupSlice.reducer;