
import { configureStore} from '@reduxjs/toolkit';
import type { Action, ThunkAction } from '@reduxjs/toolkit'
 import  authReducer  from '../features/auth/authSlice';
import messageReducer from '../features/messages/messageSlice'
import contactReducer from '../features/contacts/contactSlice'
import groupReducer from '../features/groups/groupSlice'
export const store = configureStore({
  reducer: {
    auth:authReducer,
    message:messageReducer,
    contact:contactReducer,
    group:groupReducer
  
  }
})



// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>