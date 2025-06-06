import { ChatTabsContext } from "../../Context/chatTabs";
import { useContext, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/app/hook";
import { fetchUpdateLocation } from "../../Redux/features/updateProfile/updateProfileSlice";
import { useFormik } from 'formik';
import { getUpdateMessage } from "../../Redux/features/updateProfile/updateProfileSlice";
import * as Yup from 'yup';

const LocationModal = () => {
    const dispatch = useAppDispatch()
    const message = useAppSelector(getUpdateMessage)
    const [submitting, setSubmitting] = useState(false);
  
    const {updateLocationModal, toggleLocationModal} = useContext(ChatTabsContext)

    
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
    location: string;
  }
  
  
  
  
    const validationSchema = Yup.object().shape({
    
     location: Yup.string()
     });
  
    const handleSubmit = async (values: FormValues) => {
      try {
        setSubmitting(true);
        dispatch(fetchUpdateLocation(values))
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
        location:"",
      },
      validationSchema,
      onSubmit: handleSubmit,
    });
  
  
  if (!updateLocationModal) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleLocationModal}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Update Country</h2>
       
        <form className='bg-white p-6' onSubmit={formik.handleSubmit}>
              
           
        <div className="input-group border rounded bg-slate-50 max-w-sm">
   
    <label className="sr-only" htmlFor="leadingIconDefault">Country</label>
    <input   value={formik.values.location}  onChange={formik.handleChange}  name="location"    placeholder="Enter Country "  className="input input focus:outline-none h-12 bg-white  grow w-5/6"  id="leadingIconDefault" />
  </div>
  
        {formik.touched.location && formik.errors.location && (
              <div className="error">{formik.errors.location}</div>
            )}
        
                
            <div className="flex justify-between ...">
    
  </div>
            <p className="text-violet-500  mt-2  text-center">{message}</p> 
            <div className=" flex justify-end">
          <button
            className="  text-gray-600 rounded-md h-10 p-3 mr-3 hover:text-violet-600"
            onClick={toggleLocationModal}
          >
            Close
          </button>
          <button type="submit" disabled={submitting}   className="bg-violet-500 text-white h-10 p-2 rounded-md hover:bg-blue-600"   >  
          {isLoading ? 'Loading…' : 'Update Location'}
          </button>
         
        </div>
                 </form>
       
      </div>
    </div>
  );
};

export default LocationModal;