
import "../../index.css"

 import {  Navigate, useNavigate, redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from '../../Redux/app/hook';
import  {getMessage,fetchAsyncUser, getIsAuthenticated, getAuthUser,     fetch2FaLogin} from '../../Redux/features/auth/authSlice';


const TwoFactorAuth = () => {
  
   const navigate = useNavigate()

    
        const isAuthenticated = useAppSelector(getIsAuthenticated)
      
         const user= useAppSelector(getAuthUser)
    
      
    const dispatch = useAppDispatch()
  const message = useAppSelector(getMessage)
  const [submitting, setSubmitting] = useState(false);

 



useEffect(() => {
    
  dispatch(fetchAsyncUser());

}, [dispatch])

useEffect(() =>{
  if (isAuthenticated ){
    navigate('/')
  }else{
    redirect("/login")
  }

    }, [isAuthenticated,  navigate])

    

interface FormValues {
  mfacode:string,
}




  const validationSchema = Yup.object().shape({
   mfacode: Yup.string()
   });

  const handleSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      dispatch(fetch2FaLogin(values))
      navigate('/')
      console.log(values);
      // Set submitting to false after successful submission
      setSubmitting(false);

    } catch (error) {
      // Handle form submission error
      console.error(error);

      setSubmitting(false);
    
    }
  };

  const formik = useFormik({
    initialValues: {
      mfacode:'',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

          
         


  return (
  

   
          
          <div className="flex bg-slate-50  m-auto h-screen ">

           {isAuthenticated && user &&(
          <Navigate to="/" replace={true} />
        )}
         
              <div className="m-auto p-auto w-96">
              <p className="text-2xl  text-center mb-3 font-semibold">Verify Your Identity</p>
            <p className="text-center pb-5">A verification code has been sent to your email. Enter the code to continue and be redirected.</p>
            <form className='bg-white p-6' onSubmit={formik.handleSubmit}>
              
            <div className="input-group border rounded bg-slate-50 max-w-sm">
  <span className="input-group-text">
    <span className="icon-[tabler--user] text-base-content/80 size-5"><i className='bx bx-envelope w-1/6 px-6 bx-xs '></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault"> MFA code verification</label>
  <input   value={formik.values.mfacode} onChange={formik.handleChange}  name="mfacode"   type="text" placeholder="Enter MFA code!"   className="input grow input focus:outline-none h-12 bg-white w-5/6"  id="leadingIconDefault" />
</div>
    
      {formik.touched.mfacode && formik.errors.mfacode && (
            <div className="error ">{formik.errors.mfacode}</div>
          )}
     
      <br />
      
      <br />
                <div className="d-grid gap-2">
             <button type="submit" disabled={submitting}  className="w-full text-white mt-4 rounded-md bg-purple-400 h-12"   >Verify MFA code</button>
               </div> 
  
          <p className="text-danger mt-2 fs-5 text-center">{message}</p> 
               </form>
  
         
             
              
          
       
          </div>    
          </div>
     
   
        
      
 )
}

export default TwoFactorAuth;



