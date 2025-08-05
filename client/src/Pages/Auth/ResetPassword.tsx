

import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/app/hook';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchResetPassword, getMessage, getError } from '../../Redux/features/auth/authSlice';


const ResetPassword = () => {
  const {id} = useParams()
  const dispatch = useAppDispatch()

  const message = useAppSelector(getMessage)
  const error = useAppSelector(getError)

  const [submitting, setSubmitting] = useState(false);



interface FormValues {
  password: string;
  confirmPassword: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  token:any;
};




  const validationSchema = Yup.object().shape({
  
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
      dispatch(fetchResetPassword(values))
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
      password: '',
      confirmPassword:"",
      token:id
    },
    validationSchema,
    onSubmit: handleSubmit,
  });


         
         
  return (
   
    <section>
    
   
<center>
<div   className="d-inline-flex px-5 mx-5">
<div >
         
<p className="text-center text-dark  text-gunMetal  normal">Reset your password.</p>           
  <p className="text-center text-dark  text-gunMetal">Reset your password.
  Last step. Enter your password, and you are set. Thanks!</p>
  <form onSubmit={formik.handleSubmit}>
      <input  required   value={formik.values.password}  onChange={formik.handleChange} style={{}} name="password" className=' text-gunMetal'    type="password" placeholder="Password" />
      {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
      <br />
      <input  required className=" text-gunMetal"   value={formik.values.confirmPassword}  onChange={formik.handleChange} style={{}} name="confirmPassword"     type="password" placeholder="Confirm Password" />
       {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="error">{formik.errors.confirmPassword}</div>
          )}
      <br />
                <div className="d-grid gap-2">
             <button type="submit" disabled={submitting}   style={{margin:"20px 0px"}}  >Reset Password</button>
               </div> 

               </form>
    <div className="ms-auto fs-4 p-2"><p className="fs-6 mr-4 ">  <a href="/Login" className="text-decoration-none text-reset fs-5">Login</a></p></div>
 <p className={`${ message ?  'text-green-500 mt-2 text-center'  : 'text-red-500 mt-2 text-center'  } `}>{message ? message : error?.message.toString()}</p>
   
</div>
    
    

     
      
</div>


</center>


    </section>
 )
}

export default ResetPassword;


