import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'

import { RootState } from '../../app/store'
import axios from 'axios'

export interface updateprofileState {
    message:string,
    status:  'idle' | 'pending' | 'succeeded' | 'failed'
    error:string | null | undefined
  }

  // Define the initial value for the slice state
const initialState: updateprofileState = {
   status: 'idle' ,
   message:"",
   error:null,
  
  }
  

// eslint-disable-next-line react-refresh/only-export-components
const BASEURL = import.meta.env.VITE_APP_BASE_URL
console.log(BASEURL)

// export const fetchUpdateImage = createAsyncThunk(
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     'updateprofile/fetchUpdateImage', async (data:any) => {
//         const response= await axios.post(`${BASEURL}/updateimage`, {data}, {
//           headers: {
//               'Authorization': 'Bearer your_token', // Add any custom headers
//                "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true // Include credentials such as cookies
//       },)
//         console.log(response.data)
//         return response.data
//       });


      export const fetchUpdateBio = createAsyncThunk(
        'updateprofile/fetchUpdateBio', async (data:{about:string, }) => {
         const { about} = data
            const response= await axios.post(`${BASEURL}/updatebio`,{about},{ withCredentials: true })
            console.log(response.data)
            return response.data
          });


          export const fetchUpdateLocation = createAsyncThunk(
            'updateprofile/fetchUpdateLocation', async (data:{location:string, }) => {
             const { location} = data
                const response= await axios.post(`${BASEURL}/updatelocation`,{location},{ withCredentials: true })
                console.log(response.data)
                return response.data
              });

              export const fetchUpdateMobile = createAsyncThunk(
                'updateprofile/fetchUpdateMobile', async (data:{mobile:string, }) => {
                 const { mobile} = data
                    const response= await axios.post(`${BASEURL}/updatemobile`,{mobile},{ withCredentials: true })
                    console.log(response.data)
                    return response.data
                  });
            
        
        
    
            

     
         
// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const updateProfileSlice = createSlice({
  name: 'updateprofile',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

  },
   extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    // builder.addCase(fetchUpdateImage.pending, (state) => {
    //     state.status = 'pending'
    //     })
    //     .addCase(fetchUpdateImage.fulfilled, (state, action) => {
    //       state.message= action.payload.message
    //     })
    //     .addCase(fetchUpdateImage.rejected, (state, action) => {
    //       state.status = 'failed'
    //       state.error = action.error.message;
    //     })
        builder.addCase(fetchUpdateBio.pending, (state) => {
          state.status = 'pending'
          })
          .addCase(fetchUpdateBio.fulfilled, (state, action) => {
            state.message= action.payload.message
          })
          .addCase(fetchUpdateBio.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
          })
          builder.addCase(fetchUpdateMobile.pending, (state) => {
            state.status = 'pending'
            })
            .addCase(fetchUpdateMobile.fulfilled, (state, action) => {
              state.message= action.payload.message
            })
            .addCase(fetchUpdateMobile.rejected, (state, action) => {
              state.status = 'failed'
              state.error = action.error.message;
            })
            builder.addCase(fetchUpdateLocation.pending, (state) => {
              state.status = 'pending'
              })
              .addCase(fetchUpdateLocation.fulfilled, (state, action) => {
                state.message= action.payload.message
              })
              .addCase(fetchUpdateLocation.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message;
              })
    
  },
})



export const getUpdateMessage =(state:RootState) => state.updateprofile.message

// Export the slice reducer for use in the store configuration
export default updateProfileSlice.reducer;