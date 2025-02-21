


import {  useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../Redux/app/hook';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchForgotPassword, getMessage } from '../../Redux/features/auth/authSlice';

const ForgotPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch()
  const message = useAppSelector(getMessage)
  interface FormValues {
    email:string,
  }
  
  
  
  
    const validationSchema = Yup.object().shape({
     email: Yup.string().email('Invalid email').required('Email is required'),
     });
  
    const handleSubmit = async (values: FormValues) => {
      try {
        setSubmitting(true);
        dispatch(fetchForgotPassword(values))
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
        email:"",
      },
      validationSchema,
      onSubmit: handleSubmit,
    });
  

  return (
   
    <section>
   
  
<div   className="flex bg-slate-50  m-auto h-screen ">
<div  className="m-auto p-auto w-96" >
         
                
  <p className="text-center text-dark fs-1 fw-normal">Forgot Your Password?
No problem! We'll send you instructions on how to reset your password.

</p>
  <form onSubmit={formik.handleSubmit}>
  <div className="input-group border rounded bg-slate-50 max-w-sm">
  <span className="input-group-text">
    <span className="icon-[tabler--user] text-base-content/80 size-5"><i className='bx bx-envelope w-1/6 px-6 bx-xs '></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault">Email</label>
  <input   value={formik.values.email} onChange={formik.handleChange}  name="email"   type="email" placeholder="Email"   className="input grow input focus:outline-none h-12 bg-white w-5/6"  id="leadingIconDefault" />
</div>
    
      {formik.touched.email && formik.errors.email && (
            <div className="error ">{formik.errors.email}</div>
          )}
      <br />
      <div className="d-grid gap-2">
             <button type="submit" disabled={submitting}  className="w-full text-white mt-4 rounded-md bg-purple-400 h-12"   >Send Reset Token</button>
               </div> 
               <p className="text-violet-500  mt-2  text-center">{message}</p> 
               <div className="d-flex mb-3">
         
           


          </div>
               </form>
    
    
    <div className="d-flex mb-3">
 <div className="p-2"><p style={{color:'red', textDecoration:'none'}}>{message}</p></div>
 
 
</div>
    
    

     
      
</div>
</div>




    </section>
 )
}

export default ForgotPassword;



