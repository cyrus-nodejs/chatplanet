import { ChatTabsContext } from "../../Context/chatTabs";
import { useContext, useEffect,  useState } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/app/hook";
import { fetchAddContacts } from "../../Redux/features/contacts/contactSlice";
import { useFormik } from 'formik';
import { getContactMessage} from "../../Redux/features/contacts/contactSlice";
import * as Yup from 'yup';

const ContactModal = () => {
    const dispatch = useAppDispatch()
    const message = useAppSelector(getContactMessage)
    const [submitting, setSubmitting] = useState(false);
  
    const {isContactModalOpen, toggleContactModal} = useContext(ChatTabsContext)

    const [isLoading, setLoading] = useState(false);

   useEffect(() => {
     function simulateNetworkRequest() {
       return new Promise((resolve) => setTimeout(resolve, 2000));
     }
 
     if (isLoading) {
       simulateNetworkRequest().then(() => {
         setLoading(false);
       });
     }
   }, [isLoading]);
  
  
  interface FormValues {
    
    email:string,
    invitation: string;
  }
  
  
  
  
    const validationSchema = Yup.object().shape({
     email: Yup.string().email('Invalid email').required('Email is required'),
     invitation: Yup.string()
     });
  
    const handleSubmit = async (values: FormValues) => {
      try {
        setSubmitting(true);
        dispatch(fetchAddContacts(values))
        setLoading(true)
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
        invitation: '',
        email:"",
      },
      validationSchema,
      onSubmit: handleSubmit,
    });
  
  
  if (!isContactModalOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleContactModal}
    >
      <div
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Add Contact</h2>
       
        <form className=' p-6' onSubmit={formik.handleSubmit}>
              
              <div className="input-group border rounded max-w-sm">
  
    <label className="sr-only" htmlFor="leadingIconDefault">Email</label>
    <input   value={formik.values.email} onChange={formik.handleChange}  name="email"   type="email" placeholder="Email"   className="input grow bg-white input dark:bg-gray-800 text-black dark:text-white  focus:outline-none h-10  w-5/6"  id="leadingIconDefault" />
  </div>
      
        {formik.touched.email && formik.errors.email && (
              <div className="error ">{formik.errors.email}</div>
            )}
       
        <br />
        <div className="input-group border rounded bg-slate-50 max-w-sm">
   
    <label className="sr-only" htmlFor="leadingIconDefault">Invitation Message</label>
    <input     value={formik.values.invitation}  onChange={formik.handleChange}  name="invitation"      placeholder="Enter Message"   className="input input focus:outline-none  h-24 bg-white  dark:bg-gray-800 text-black dark:text-white  w-full "  id="leadingIconDefault" />
  </div>
  
        {formik.touched.invitation && formik.errors.invitation && (
              <div className="error">{formik.errors.invitation}</div>
            )}
        
                
            <div className="flex justify-between ...">
    
  </div>
            <p className="text-violet-500  mt-2  text-center">{message}</p> 
            <div className=" flex justify-end">
          <button
            className="  text-gray-600 rounded-md h-10 p-3 mr-3 hover:text-violet-600"
            onClick={toggleContactModal}
          >
            Close
          </button>
          <button type="submit" disabled={submitting}   className="bg-violet-500 text-white h-10 p-2 rounded-md hover:bg-blue-600"   > 
          {isLoading ? 'Loading…' : ' Add Contact'}
          </button>
         
        </div>
                 </form>
       
      </div>
    </div>
  );
};

export default ContactModal;