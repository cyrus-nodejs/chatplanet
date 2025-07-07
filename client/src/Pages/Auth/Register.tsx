



import {useState} from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../Redux/app/hook';
import { fetchRegister, getMessage } from '../../Redux/features/auth/authSlice';





const Register = ( ) => {
  const dispatch = useAppDispatch()
  const message = useAppSelector(getMessage)
  const [submitting, setSubmitting] = useState(false);



interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile:string;
}




  const validationSchema = Yup.object().shape({
   firstname: Yup.string()
   .min(2, 'Name must be minimum 2')
   .max(100, 'Name must not be more than 100 characters')
   .required('Name is required'),
   lastname: Yup.string()
   .min(2, 'Name must be minimum 2')
   .max(100, 'Name must not be more than 100 characters')
   .required('Name is required'),
   email: Yup.string().email('Invalid email').required('Email is required'),
   mobile: Yup.string()
   .matches(/^[0-9]{10}$/,  // Simple regex for 10 digit phone numbers
      "Phone number must be 10 digits")
  .required("Phone number is required"),
   password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
   confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
   });

  const handleSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      dispatch(fetchRegister(values))
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
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile:"",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

 

  return (
    

   


 <div className=" flex bg-slate-50  mx-auto h-screen  ">
 <div className="mx-auto px-auto w-96 ">

                
  <h6 className=" text-xl text-center  text-gunMetal font-semibold pb-1" >Register</h6>
  <p className='text-center text-sm pb-1  text-gunMetal'>Get your ChatPlanet account now. </p>

  <form className='bg-white p-3' onSubmit={formik.handleSubmit}>
  <div className="input-group border max-w-sm  bg-slate-50 ">
  <span className="input-group-text">
    <span className="icon-[tabler--user]  text-gunMetal text-base-content/80 size-5"><i className='bx bx-user w-1/6 px-6 bx-xs ' ></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault">Firstname</label>
  <input   onChange={formik.handleChange} value={formik.values.firstname}   name="firstname"type="text"  placeholder="firstname"   className=" h-12 input focus:outline-none  text-gunMetal bg-white grow w-5/6"  id="leadingIconDefault" />
</div>
   
  {formik.touched.firstname && formik.errors.firstname && (
            <div className="error ">{formik.errors.firstname}</div>
          )}
      <br /> 
      <div className="input-group border max-w-sm rounded bg-slate-50">
  <span className="input-group-text ">
    <span className="icon-[tabler--user]  text-gunMetal text-base-content/80 size-5"><i className='bx bx-user-circle w-1/6 px-6 bx-xs '></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault">Last Name</label>
  <input onChange={formik.handleChange} value={formik.values.lastname}   name="lastname"   type="text"  placeholder="lastname"   className=" input  text-gunMetal focus:outline-none h-12 bg-white grow w-5/6"  id="leadingIconDefault" />
</div>
    
      {formik.touched.lastname && formik.errors.lastname && (
            <div className="error ">{formik.errors.lastname}</div>
          )}
      <br />
      <div className="input-group border rounded bg-slate-50 max-w-sm">
  <span className="input-group-text">
    <span className="icon-[tabler--user]  text-gunMetal text-base-content/80 size-5"><i className='bx bxs-phone w-1/6 px-6 bx-xs'></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault">Mobile</label>
  <input   value={formik.values.mobile} onChange={formik.handleChange}  name="mobile"  placeholder="Phone number"    type="tel"   className=" text-gunMetal grow input focus:outline-none h-12 bg-white w-5/6"  id="" />
</div>
    
      {formik.touched.email && formik.errors.mobile && (
            <div className="error ">{formik.errors.mobile}</div>
          )}
      
      <br />
      <div className="input-group border rounded bg-slate-50 max-w-sm">
  <span className="input-group-text">
    <span className="icon-[tabler--user]  text-gunMetal text-base-content/80 size-5"><i className='bx bx-envelope w-1/6 px-6 bx-xs '></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault">Email</label>
  <input   value={formik.values.email} onChange={formik.handleChange}  name="email"   type="email" placeholder="Email"   className="grow input  text-gunMetal focus:outline-none h-12 bg-white w-5/6"  id="leadingIconDefault" />
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
  <input   value={formik.values.password}  onChange={formik.handleChange}  name="password"     type="password" placeholder="Password"   className=" text-gunMetal input focus:outline-none   h-12 bg-white  grow w-5/6"  id="leading" />
</div>

      {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
      <br />
      <div className="input-group border max-w-sm rounded bg-slate-50">
  <span className="input-group-text ">
    <span className="icon-[tabler--user]  text-gunMetal text-base-content/80 size-5"><i className='bx bxs-lock w-1/6 px-6 bx-xs '></i></span>
  </span>
  <label className="sr-only" htmlFor="leadingIconDefault">Confirm Password</label>
  <input   value={formik.values.confirmPassword}  onChange={formik.handleChange}  name="confirmPassword"     type="password" placeholder="Confirm Password"   className="input focus:outline-none  text-gunMetal grow w-5/6 h-12 bg-white"  id="leadingIconDefault" />
</div>
       
       {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="error">{formik.errors.confirmPassword}</div>
          )}
    
     
      <div className="d-grid gap-2">
    
    <button  type="submit" disabled={submitting}   className='w-full text-white mt-4 rounded-md bg-purple-400 h-12'      >Sign up</button>
   
     </div> 
     <div >
    
    </div>
    <div className="flex  justify-center mt-2">
  <div><p className="fs-6  text-gunMetal"> Already registered?  <a href="/login" className='text-violet-600'>  Please sign in</a></p></div>

</div>
    <p className="text-violet-500   text-center">{message}</p>  
     </form>
    
</div>

</div>


  )
}

export default Register;