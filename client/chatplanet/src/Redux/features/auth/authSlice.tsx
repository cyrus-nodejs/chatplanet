import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'
import { USER } from '../../../utils/types'
import { RootState } from '../../app/store'
import axios from 'axios'

import Cookies from 'js-cookie';


const token = Cookies.get('token'); 
const token2 = Cookies.get('accessToken') 
console.log(token)
console.log(token2)

export interface AuthState {
  onlineUsers:USER[]
  allUsers:USER[]
   authUser: USER | null | undefined 
    twoFaUser:USER | null | undefined 
    isAuthenticated: boolean
    status:  'idle' | 'pending' | 'succeeded' | 'failed'
    error:string | null | undefined
    message:string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token:any
  }

  // Define the initial value for the slice state
const initialState: AuthState = {
  onlineUsers:[],
  allUsers:[],
   authUser: null,
    twoFaUser:null,
    isAuthenticated: false,
    message:"",
    status: 'idle' ,
    token:null,
    error:null
  }
  

// eslint-disable-next-line react-refresh/only-export-components
const BASEURL = import.meta.env.VITE_APP_BASE_URL
console.log(BASEURL)

export const fetchAsyncUser = createAsyncThunk(
    'auth/fetchAsyncUser', async () => {
        const response= await axios.post(`${BASEURL}`,{}, { withCredentials: true })
        console.log(response.data)
        return response.data
      });

      export const fetch2FAUser = createAsyncThunk(
        'auth/fetch2FAUser', async () => {
            const response= await axios.post(`${BASEURL}/2fa/verify`,{}, { withCredentials: true } )
            console.log(response.data)
            return response.data
          });

      export const fetchLogin = createAsyncThunk(
        'auth/fetchLogin', async (data:{email:string, password:string}) => {
         const { email, password} = data
            const response= await axios.post(`${BASEURL}/login`,{email, password},   
              { withCredentials: true }  )
            console.log(response.data)
            return response.data
          });

          export const fetch2FaLogin = createAsyncThunk(
            'auth/fetch2FaLogin', async (data:{mfacode:string}) => {
             const { mfacode} = data
                const response= await axios.post(`${BASEURL}/login/2fa`,{mfacode},{ withCredentials: true })
                console.log(response.data)
                return response.data
              });

          export const fetchRegister = createAsyncThunk(
            'auth/fetchRegister', async (data:{firstname:string, lastname:string,  email:string, password:string, mobile:string}) => {
           const   {firstname, lastname, email, mobile,  password} = data
                const response= await axios.post(`${BASEURL}/register`, {firstname, mobile,   lastname, email, password}, { withCredentials: true })
                console.log(response.data)
                return response.data
              });
        

  export const fetchAsyncLogout = createAsyncThunk(
    'auth/fetchAsyncLogout',  async () => {
        const response= await axios.post(`${BASEURL}/logout`,{}, { withCredentials: true })
        console.log(response.data)
        return response.data
      });
      export const fetchForgotPassword = createAsyncThunk(
        'auth/fetchForgotPassword',  async (data:{email:string}) => {
         const {email} = data
            const response= await axios.post(`${BASEURL}/forgotpassword`,{email}, { withCredentials: true })
            console.log(response.data)
            return response.data
          });
          export const fetchResetPassword = createAsyncThunk(
            'auth/fetchResetPassword',  async (data:{ password:string, token:string}) => {
               const { password, token} = data
              const response= await axios.post(`${BASEURL}/resetpassword/${token}`,{ password, token}, { withCredentials: true })
                console.log(response.data)
                return response.data
              });
            
              export const fetchOnlineUsers = createAsyncThunk(
                'contact/fetchOnlineUsers', async () => {
                    const response= await axios.get(`${BASEURL}/onlineusers`, { withCredentials: true })
                    console.log(response.data)
                    return response.data
                  });
            
                

                  export const fetchAllUsers = createAsyncThunk(
                    'contact/fetchAllUsers', async () => {
                        const response= await axios.get(`${BASEURL}/allusers`, { withCredentials: true })
                        console.log(response.data)
                        return response.data
                      });
                      
         
// Slices contain Redux reducer logic for updating state, and
// generate actions that can be dispatched to trigger those updates.
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    handleLogout: (state) => {
      Cookies.remove('accessToken')
      Cookies.remove('token')
      state.authUser = null
      state.isAuthenticated = false
     }
  },
   extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAsyncUser.pending, (state) => {
      state.status = 'pending'
      
    })
    .addCase(fetchAsyncUser.fulfilled, (state, action) => {
         state.authUser= action.payload.user
         state.isAuthenticated = true
         state.message= action.payload.message
     
      })
      .addCase(fetchAsyncUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message;
        
      })
      builder.addCase(fetch2FAUser.pending, (state) => {
        state.status = 'pending'
        
      })
      .addCase(fetch2FAUser.fulfilled, (state, action) => {
        state.twoFaUser= action.payload.user
        state.authUser= action.payload.user
        state.isAuthenticated = true
        state.message= action.payload.message
        })
        .addCase(fetch2FAUser.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message;
          
        })
      .addCase(fetchAsyncLogout.pending, (state) => {
      state.status = 'pending'
      state.authUser= null
      
      })
      
      .addCase(fetchAsyncLogout.fulfilled, (state) => {
      state.status = 'succeeded'
      })
      .addCase(fetchAsyncLogout.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message;
      })
      .addCase(fetchLogin.pending, (state) => {
        state.status = 'pending'
        })
        .addCase(fetchLogin.fulfilled, (state, action) => {
          state.token = action.payload.token
          state.message= action.payload.message
          
          
        })
        .addCase(fetchLogin.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message;
        })
        .addCase(fetch2FaLogin.pending, (state) => {
          state.status = 'pending'
          })
          .addCase(fetch2FaLogin.fulfilled, (state, action) => {
            state.message= action.payload.message
          })
          .addCase(fetch2FaLogin.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
          })
        .addCase(fetchRegister.pending, (state) => {
      state.status = 'pending'
     
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.message= action.payload.message
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message;
      })
      
      .addCase(fetchForgotPassword.pending, (state) => {
        state.status = 'pending'
        
        })
        .addCase(fetchForgotPassword.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.message = action.payload.message
        })
        .addCase(fetchForgotPassword.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.error.message;
          
        })
        .addCase(fetchResetPassword.pending, (state) => {
          state.status = 'pending'
          })
          .addCase(fetchResetPassword.fulfilled, (state, action) => {
            state.isAuthenticated = true
            state.message= action.payload.message
            
          })
          .addCase(fetchResetPassword.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
          })
          builder.addCase(fetchOnlineUsers.pending, (state) => {
            state.status = 'pending'
            
          })
          .addCase(fetchOnlineUsers.fulfilled, (state, action) => {
               state.onlineUsers= action.payload.users
               state.message= action.payload.message
            })
            .addCase(fetchOnlineUsers.rejected, (state, action) => {
              state.status = 'failed'
              state.error = action.error.message;
              
            })
            builder.addCase(fetchAllUsers.pending, (state) => {
              state.status = 'pending'
              
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                 state.allUsers= action.payload.users
                 state.message= action.payload.message
              })
              .addCase(fetchAllUsers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message;
                
              })
      
  },
})

// Export the generated action creators for use in components
export const getToken = (state:RootState) => state.auth.token
export const getTwoFaUser = (state:RootState) => state.auth.twoFaUser
export const getAuthUser = (state:RootState) => state.auth.authUser
export const getIsAuthenticated = (state:RootState) => state.auth.isAuthenticated
export const getAuthError = (state:RootState) => state.auth.error
export const getAuthStatus = (state:RootState) => state.auth.status
export const getOnlineUsers = (state:RootState) => state.auth.onlineUsers
export const getAllUsers = (state:RootState) => state.auth.allUsers
export const getMessage =(state:RootState) => state.auth.message

export const {handleLogout} = authSlice.actions
// Export the slice reducer for use in the store configuration
export default authSlice.reducer;