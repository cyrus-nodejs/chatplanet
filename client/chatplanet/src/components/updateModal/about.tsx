import { ChatTabsContext } from "../../Context/chatTabs";
import { useContext, useEffect,  useState } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/app/hook";
import { fetchUpdateBio } from "../../Redux/features/updateProfile/updateProfileSlice";
import { useFormik } from 'formik';
import { getUpdateMessage } from "../../Redux/features/updateProfile/updateProfileSlice";
import * as Yup from 'yup';

const AboutModal = () => {
    const dispatch = useAppDispatch()
    const message = useAppSelector(getUpdateMessage)
    const [submitting, setSubmitting] = useState(false);
  
    const {updateBioModal, toggleBioModal} = useContext(ChatTabsContext)

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
    about: string;
  }
  
  
  
  
    const validationSchema = Yup.object().shape({
    
     about: Yup.string().max(50, 'Bio must not be more than 50 characters')
     });
  
    const handleSubmit = async (values: FormValues) => {
      try {
        setSubmitting(true);
        dispatch(fetchUpdateBio(values))
        // Set submitting to false after successful submission
        setLoading(true)
        setSubmitting(false);
      } catch (error) {
        // Handle form submission error
        console.error(error);
        setSubmitting(false);
      }
    };
  
    const formik = useFormik({
      initialValues: {
        about:"",
      },
      validationSchema,
      onSubmit: handleSubmit,
    });
  
  
  if (!updateBioModal) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleBioModal}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Update About</h2>
       
        <form className='bg-white p-6' onSubmit={formik.handleSubmit}>
              
           
        <div className="input-group border rounded bg-slate-50 max-w-sm">
   
    <label className="sr-only" htmlFor="leadingIconDefault">Bio Summary</label>
    <textarea   value={formik.values.about}  onChange={formik.handleChange}  name="about"      rows={10}  className="input input focus:outline-none  h-24  bg-white  w-full"  id="leadingIconDefault" />
  </div>
  
        {formik.touched.about && formik.errors.about && (
              <div className="error">{formik.errors.about}</div>
            )}
        
                
            <div className="flex justify-between ...">
    
  </div>
            <p className="text-violet-500  mt-2  text-center">{message}</p> 
            <div className=" flex justify-end">
          <button
            className="  text-gray-600 rounded-md h-10 p-3 mr-3 hover:text-violet-600"
            onClick={toggleBioModal}
          >
            Close
          </button>
          <button type="submit" disabled={submitting}   className="bg-violet-500 text-white h-10 p-2 rounded-md hover:bg-blue-600"   >   {isLoading ? 'Loading…' : 'Update Bio'}</button>
         
        </div>
                 </form>
       
      </div>
    </div>
  );
};

export default AboutModal;