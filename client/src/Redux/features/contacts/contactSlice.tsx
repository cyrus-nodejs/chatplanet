import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'
import {  CONTACTS } from '../../../utils/types'
import { RootState } from '../../app/store'
import axios from 'axios'

export interface contactState {
    contacts: CONTACTS[] 
    message:string,
    status:  'idle' | 'pending' | 'succeeded' | 'failed'
    error:string | null | undefined
  }

  // Define the initial value for the slice state
const initialState: contactState = {
   contacts: [],
   status: 'idle' ,
   message:"",
   error:null,
  
  }
  

// eslint-disable-next-line react-refresh/only-export-components
const BASEURL = import.meta.env.VITE_APP_BASE_URL
console.log(BASEURL)

export const fetchAddContacts = createAsyncThunk(
    'contact/fetchAddContacts', async (data:{email:string, invitation:string}) => {
     const { email, invitation} = data
        const response= await axios.post(`${BASEURL}/addcontact`,{email, invitation},{ withCredentials: true })
        console.log(response.data)
        return response.data
      });

export const fetchContacts = createAsyncThunk(
    'contact/fetchContacts', async () => {
        const response= await axios.get(`${BASEURL}/getcontacts`, { withCredentials: true })
        console.log(response.data)
        return response.data
      });

    
            

     
         
// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },
   extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchContacts.pending, (state) => {
      state.status = 'pending'
      
    })
    .addCase(fetchContacts.fulfilled, (state, action) => {
         state.contacts= action.payload.contacts
         state.message= action.payload.message
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message;
        
      })
     
      .addCase(fetchAddContacts.pending, (state) => {
        state.status = 'pending'
        })
        .addCase(fetchAddContacts.fulfilled, (state, action) => {
          state.message= action.payload.message
        })
        .addCase(fetchAddContacts.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message;
        })
    
  },
})


export const getAllContacts =(state:RootState) => state.contact.contacts
export const getContactMessage =(state:RootState) => state.contact.message

// Export the slice reducer for use in the store configuration
export default contactSlice.reducer;