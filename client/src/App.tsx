import Index from './Pages/Home/Index'

import './App.css'
import ResetPassword from "./Pages/Auth/ResetPassword";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import TwoFactorAuth from './Pages/Auth/TwoFactorAuth';
import ErrorPage from './Pages/Auth/Error';
import IsAuthorizedRoute from './Pages/ProtectedRoutes/isAuthorizedRoutes';

import { useEffect } from 'react';
import { fetchAsyncUser } from './Redux/features/auth/authSlice';
import { useAppDispatch } from './Redux/app/hook';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";








function App() {
  
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    
  dispatch(fetchAsyncUser());

}, [dispatch])

  


 

  const router = createBrowserRouter([
    {
    path: "/",
    element: (
      <IsAuthorizedRoute>
        <Index />
      </IsAuthorizedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: `/register`,
    element: <Register   />,
    errorElement: <ErrorPage />
  },

  {
    path: `/login`,
    element: <Login   />,
    errorElement: <ErrorPage />
  },
  {
    path: `/forgotpassword`,
    element: <ForgotPassword   />,
    errorElement: <ErrorPage />
  },

  {
    path: `/resetpassword/:id`,
    element: <ResetPassword   />,
    errorElement: <ErrorPage />
  },
  {
    path: `/2facode/verify`,
    element:  (
        <TwoFactorAuth />
    ),
    errorElement: <ErrorPage />
  }
])

  return (
    
    <div className=" h-screen   ">
      
       <RouterProvider router={router}  />
       
</div>

  )
}

export default App
