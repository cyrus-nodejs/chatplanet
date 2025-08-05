import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit'
import { USER } from '../../../utils/types'
import { RootState } from '../../app/store'
import axios from '../../../utils/axios/axiosconfig'



export interface AuthState {
  onlineUsers:USER[]
  allUsers:USER[]
   authUser: USER | null | undefined 
     sessionId: string | null
    isAuthenticated: boolean
     isAuthorized: boolean
    status:  'idle' | 'pending' | 'succeeded' | 'failed'
    success:boolean
    error:null | { success: boolean; message: string }
    message:string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token:any
  }

  // Define the initial value for the slice state
const initialState: AuthState = {
  onlineUsers:[],
  allUsers:[],
   authUser: null,
    sessionId:null,
    isAuthenticated: false,
    isAuthorized: false,
    message:"",
    status: 'idle' ,
    success:false,
    token:null,
    error:null
  }
  

// eslint-disable-next-line react-refresh/only-export-components
const BASEURL = import.meta.env.VITE_APP_BASE_URL
console.log(BASEURL)
// Get authenticated User
export const fetchAsyncUser = createAsyncThunk(
    'auth/fetchAsyncUser', async () => {
        const response= await axios.get(`${BASEURL}/user`, { withCredentials: true })
        console.log(response.data)
        return response.data
      });

  
//   // Login routes
      export const fetchLogin = createAsyncThunk(
        'auth/fetchLogin', async (data:{email:string, password:string},  { rejectWithValue }) => {
         const { email, password} = data
         try {
            const response= await axios.post(`${BASEURL}/login`, {email, password}, { withCredentials: true }  )
            console.log(response.data)
            return response.data
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         } catch (err: any) {
      if (err.response && err.response.data) {
        // Pass full backend error response
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ success: false, message: err.message });
    }
  }
          );

          // Multifactor factor authentication verifcation route
          export const twoFactorLogin = createAsyncThunk(
            'auth/twoFactorLogin', async (data:{mfacode:string}) => {
             const { mfacode} = data
                const response= await axios.post(`${BASEURL}/login/2fa`, {mfacode}, { withCredentials: true })
                console.log(response.data)
                return response.data
              });

          // Sigup routes
          export const fetchRegister = createAsyncThunk(
            'auth/fetchRegister', async (data:{firstname:string, lastname:string,  email:string, password:string, mobile:string}) => {
           const   {firstname, lastname, email, mobile,  password} = data
                const response= await axios.post(`${BASEURL}/register`, {firstname, mobile,   lastname, email, password}, { withCredentials: true })
                console.log(response.data)
                return response.data
              });
        
 // Log out route
  export const fetchAsyncLogout = createAsyncThunk(
    'auth/fetchAsyncLogout',  async () => {
        const response= await axios.get(`${BASEURL}/logout`, { withCredentials: true })
        console.log(response.data)
        return response.data
      });

      // Forgot password route
      export const fetchForgotPassword = createAsyncThunk(
        'auth/fetchForgotPassword',  async (data:{email:string}) => {
         const {email} = data
            const response= await axios.post(`${BASEURL}/forgotpassword`,{email}, { withCredentials: true })
            console.log(response.data)
            return response.data
          });

        //Reset password route
          export const fetchResetPassword = createAsyncThunk(
            'auth/fetchResetPassword',  async (data:{ password:string, token:string}) => {
               const { password, token} = data
              const response= await axios.post(`${BASEURL}/resetpassword/${token}`,{ password, token}, { withCredentials: true })
                console.log(response.data)
                return response.data
              });
            
            // Get all online users
              export const fetchOnlineUsers = createAsyncThunk(
                'contact/fetchOnlineUsers', async () => {
                    const response= await axios.get(`${BASEURL}/onlineusers`, { withCredentials: true })
                    console.log(response.data)
                    return response.data
                  });
            
                
                // Get all users
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
  
  },
   extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAsyncUser.pending, (state) => {
      state.status = 'pending'
      
    })
    .addCase(fetchAsyncUser.fulfilled, (state, action) => {
         state.authUser= action.payload.user
         state.isAuthorized = action.payload.success
         state.message= action.payload.message
      })
      .addCase(fetchAsyncUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as AuthState['error'];
       
        
      })

      .addCase(fetchAsyncLogout.pending, (state) => {
      state.status = 'pending'
      state.authUser= null
      
      })
      
      .addCase(fetchAsyncLogout.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.message= action.payload.message
    
      })
      .addCase(fetchAsyncLogout.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as AuthState['error'];
      })

      .addCase(fetchLogin.pending, (state) => {
        state.status = 'pending'
        })
        .addCase(fetchLogin.fulfilled, (state, action) => {
          state.message= action.payload.message
          state.isAuthenticated = true
          window.location.href = '/2facode/verify'
        })
        .addCase(fetchLogin.rejected, (state, action) => {
          state.status = 'failed'
          state.error = action.payload as AuthState['error'];
           
          //  state.message = action.payload
        })

        .addCase(twoFactorLogin.pending, (state) => {
          state.status = 'pending'
          })
          .addCase(twoFactorLogin.fulfilled, (state, action) => {
            state.authUser= action.payload.user
            state.isAuthorized = action.payload.success
            state.message= action.payload.message
             window.location.href = '/'
          })
          .addCase(twoFactorLogin.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload as AuthState['error'];
            
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
        state.error = action.payload as AuthState['error'];
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
          state.error = action.payload as AuthState['error'];
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
            state.error = action.payload as AuthState['error'];
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
              state.error = action.payload as AuthState['error'];
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
                state.error = action.payload as AuthState['error'];
                
              })
      
  },
})

// Export the generated action creators for use in components
export const getToken = (state:RootState) => state.auth.token
export const getAuthUser = (state:RootState) => state.auth.authUser
export const getIsAuthenticated = (state:RootState) => state.auth.isAuthenticated
export const getIsAuthorized = (state:RootState) => state.auth.isAuthorized
export const getAuthError = (state:RootState) => state.auth.error
export const getAuthStatus = (state:RootState) => state.auth.status
export const getAuthSuccess = (state:RootState) => state.auth.success
export const getOnlineUsers = (state:RootState) => state.auth.onlineUsers
export const getAllUsers = (state:RootState) => state.auth.allUsers
export const getMessage =(state:RootState) => state.auth.message
export const getError =(state:RootState) => state.auth.error
export const getSessionId =(state:RootState) => state.auth.sessionId
export const getSuccessStatus =(state:RootState) => state.auth.success


// Export the slice reducer for use in the store configuration
export default authSlice.reducer;