

import "../../index.css"

import { Navigate } from "react-router-dom";

import { useFormik } from 'formik';
import * as Yup from 'yup';


import {  useState} from 'react';

import { useAppDispatch, useAppSelector } from '../../Redux/app/hook';
import  {getMessage, getAuthUser, getIsAuthorized , getError,  fetchLogin} from '../../Redux/features/auth/authSlice';


const Login = () => {
  interface FormValues {
    password: string;
    email:string,
  }
   
  // const navigate = useNavigate()
  const dispatch = useAppDispatch()
  

      
  const message = useAppSelector(getMessage)
  const user = useAppSelector(getAuthUser)
  const isAuthorized = useAppSelector(getIsAuthorized)
  const error = useAppSelector(getError)
  //  const success = useAppSelector(getAuthSuccess)

  const [submitting, setSubmitting] = useState(false);




  const validationSchema = Yup.object().shape({
   email: Yup.string().email('Invalid email').required('Email is required'),
   password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
   });

  const handleSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      dispatch(fetchLogin(values))
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
      password: "",
      email:"",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });



  return (

          
          <div className="flex bg-slate-50  m-auto h-screen ">
       { isAuthorized && user && (
          <Navigate to="/" replace={true} />
        )}
              <div className="m-auto p-auto w-96">
              <p className="text-2xl text-gunMetal  text-center mb-3 font-semibold">ChatPlanet</p>
            <p className="text-center  text-gunMetal pb-5">Sign in to continue ChatPlanet</p>
            <form className='bg-white p-6' onSubmit={formik.handleSubmit}>
              
            <div className="input-group border rounded bg-slate-50 max-w-sm">
  <span className="input-group-text">
    <span className="icon-[tabler--user] text-base-content/80 size-5  text-gunMetal"><i className='bx bx-envelope w-1/6 px-6 bx-xs  text-gunMetal '></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault">Email</label>
  <input   value={formik.values.email} onChange={formik.handleChange}  name="email"   type="email" placeholder="Email"   className=" text-gunMetal grow input focus:outline-none h-12 bg-white w-5/6"  id="leadingIconDefault" />
</div>
    
      {formik.touched.email && formik.errors.email && (
            <div className="error ">{formik.errors.email}</div>
          )}
     
      <br />
      <div className="input-group border rounded bg-slate-50 max-w-sm">
  <span className="input-group-text">
    <span className="icon-[tabler--user]  text-gunMetal text-base-content/80 size-5"><i className='bx bx-lock-alt w-1/6 px-6 bx-xs '></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault">Password</label>
  <input   value={formik.values.password}  onChange={formik.handleChange}  name="password"     type="password" placeholder="Password"   className=" text-gunMetal input focus:outline-none   h-12 bg-white  grow w-5/6"  id="leadingIconDefault" />
</div>

      {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
      <br />
                <div className="d-grid gap-2">
             <button type="submit" disabled={submitting}  className="w-full text-white mt-4 rounded-md bg-purple-400 h-12"   >Sign in</button>
               </div> 
   
               <div className="d-flex mb-3">
         
           


          </div>
          <div className="flex justify-between ...">
  <div><a href="/forgotpassword" className='text-violet-500'>Forgot password?</a></div>

  <div className=' text-gunMetal'> Not registered?  <a href="/register" className='text-violet-500' >Sign up</a></div>
</div>
 <p className={`${ message ?  'text-green-500 mt-2 text-center'  : 'text-red-500 mt-2 text-center'  } `}>{message ? message : error?.message.toString()}</p>
               </form>
  
         
             
              
          
       
          </div>    
          </div>
     
   
        
      
 )
}

export default Login;



