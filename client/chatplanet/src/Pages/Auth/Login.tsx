
import {  useNavigate,  } from 'react-router-dom';
import "../../index.css"



import { useFormik } from 'formik';
import * as Yup from 'yup';


import {  useState, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../Redux/app/hook';
import  {getMessage,   fetchLogin, fetch2FAUser} from '../../Redux/features/auth/authSlice';


const Login = () => {
   const navigate = useNavigate()
  
  
  //  const mfauser = useAppSelector(getTwoFaUser)


      
    const dispatch = useAppDispatch()
  const message = useAppSelector(getMessage)
  const [submitting, setSubmitting] = useState(false);



interface FormValues {
  password: string;
  email:string,
}




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
      navigate('/2facode/verify')
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
      password: '',
      email:"",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    
    dispatch(fetch2FAUser());

}, [dispatch])

// useEffect(() => {
//   if (mfauser)  {
//    navigate("/2facode/verify")
//   }else{
//     redirect('/login')
//   }
 

// }, [navigate, mfauser])
  
         

  return (
  

   
          
          <div className="flex bg-slate-50  m-auto h-screen ">
   
              <div className="m-auto p-auto w-96">
              <p className="text-2xl  text-center mb-3 font-semibold">ChatPlanet</p>
            <p className="text-center pb-5">Sign in to continue ChatPlanet</p>
            <form className='bg-white p-6' onSubmit={formik.handleSubmit}>
              
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
      <div className="input-group border rounded bg-slate-50 max-w-sm">
  <span className="input-group-text">
    <span className="icon-[tabler--user] text-base-content/80 size-5"><i className='bx bx-lock-alt w-1/6 px-6 bx-xs '></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault">Password</label>
  <input   value={formik.values.password}  onChange={formik.handleChange}  name="password"     type="password" placeholder="Password"   className="input input focus:outline-none   h-12 bg-white  grow w-5/6"  id="leadingIconDefault" />
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

  <div> Not registered?  <a href="/register" className='text-violet-500' >Sign up</a></div>
</div>
          <p className="text-violet-500  mt-2  text-center">{message}</p> 
               </form>
  
         
             
              
          
       
          </div>    
          </div>
     
   
        
      
 )
}

export default Login;



