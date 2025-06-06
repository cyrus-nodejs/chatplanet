import { ChatTabsContext } from "../../Context/chatTabs";
import { useContext,  useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/app/hook";
import { fetchUpdateMobile } from "../../Redux/features/updateProfile/updateProfileSlice";
import { useFormik } from 'formik';
import { getUpdateMessage } from "../../Redux/features/updateProfile/updateProfileSlice";
import * as Yup from 'yup';

const MobileModal = () => {
    const dispatch = useAppDispatch()
    const message = useAppSelector(getUpdateMessage)
    const [submitting, setSubmitting] = useState(false);
  
    const {updateMobileModal, toggleMobileModal} = useContext(ChatTabsContext)

    
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
    mobile: string;
  }
  
  
  
  
    const validationSchema = Yup.object().shape({
     mobile: Yup.string()
     });
  
    const handleSubmit = async (values: FormValues) => {
      try {
        setSubmitting(true);
        dispatch(fetchUpdateMobile(values))
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
        mobile:"",
      },
      validationSchema,
      onSubmit: handleSubmit,
    });
  
  
  if (!updateMobileModal) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleMobileModal}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Update Phone Contact</h2>
       
        <form className='bg-white p-6' onSubmit={formik.handleSubmit}>
              
           
        <div className="input-group border rounded bg-slate-50 max-w-sm">
   
    <label className="sr-only" htmlFor="leadingIconDefault">Phone Contact</label>
    <input   value={formik.values.mobile}  onChange={formik.handleChange}  name="mobile"      placeholder="Enter Phone Contact "  className="input input focus:outline-none  h-12  bg-white  grow w-5/6"  id="leadingIconDefault" />
  </div>
  
        {formik.touched.mobile && formik.errors.mobile && (
              <div className="error">{formik.errors.mobile}</div>
            )}
        
                
            <div className="flex justify-between ...">
    
  </div>
            <p className="text-violet-500  mt-2  text-center">{message}</p> 
            <div className=" flex justify-end">
          <button
            className="  text-gray-600 rounded-md h-10 p-3 mr-3 hover:text-violet-600"
            onClick={toggleMobileModal}
          >
            Close
          </button>
          <button type="submit" disabled={submitting}   className="bg-violet-500 text-white h-10 p-2 rounded-md hover:bg-blue-600"   >  
          {isLoading ? 'Loading…' : 'Update Phone Contact'}
          </button>
         
        </div>
                 </form>
       
      </div>
    </div>
  );
};

export default MobileModal;