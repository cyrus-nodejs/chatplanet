import Index from './Pages/Home/Index'
 

import './App.css'
import ResetPassword from "./Pages/Auth/ResetPassword";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import TwoFactorAuth from './Pages/Auth/TwoFactorAuth';
import ErrorPage from './Pages/Auth/Error';

import { useEffect } from 'react';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";








function App() {
  useEffect(() => {
    // Check if HSStaticMethods is available
    if (window.HSStaticMethods && window.HSStaticMethods.autoInit) {
      window.HSStaticMethods.autoInit();
    } else {
      console.error('HSStaticMethods is not available or autoInit is undefined');
    }
  }, []); // Empty dependency array to run this once after the component mounts

  
  
  


 

  const router = createBrowserRouter([
    {
    path: "/",
    element: <Index />,
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
    element: <TwoFactorAuth  />,
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
