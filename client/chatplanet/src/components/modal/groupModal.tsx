import { ChatTabsContext } from "../../Context/chatTabs";
import { useContext,   useState } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/app/hook";
import { fetchAddGroup } from "../../Redux/features/groups/groupSlice";
import { useFormik } from 'formik';
import { getGroupMessage} from "../../Redux/features/groups/groupSlice";
import * as Yup from 'yup';
import {  getAllContacts } from "../../Redux/features/contacts/contactSlice";

const GroupModal = () => {

    const dispatch = useAppDispatch()
    const message = useAppSelector(getGroupMessage)
    const allContacts = useAppSelector(getAllContacts)
    console.log(allContacts)
    const [submitting, setSubmitting] = useState(false);

    const {isGroupModalOpen, toggleGroupModal} = useContext(ChatTabsContext)

  
  interface FormValues {
    name:string,
    description: string
    
  }
  
  
  
  
    const validationSchema = Yup.object().shape({
     name: Yup.string(),
     description: Yup.string(),
     });
  
    const handleSubmit = async (values: FormValues) => {
      try {
        setSubmitting(true);
        dispatch(fetchAddGroup(values))
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
        description: '',
        name:"",
        
      },
      validationSchema,
      onSubmit: handleSubmit,
    });
  
  
  if (!isGroupModalOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleGroupModal}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
       
        <form className='bg-white p-6' onSubmit={formik.handleSubmit}>
              
              <div className="input-group border rounded bg-slate-50 max-w-sm">
  
    <label className="sr-only" htmlFor="leadingIconDefault">Group Name</label>
    <input   value={formik.values.name} onChange={formik.handleChange}  name="name"   type="name" placeholder="Enter Group Name"   className="input grow input focus:outline-none h-10  bg-white w-5/6"  id="leadingIconDefault" />
  </div>
      
        {formik.touched.name && formik.errors.name && (
              <div className="error ">{formik.errors.name}</div>
            )}
       
        <br />
       
        <div className="input-group border rounded bg-slate-50 max-w-sm">
   
    <label className="sr-only" htmlFor="leadingIconDefault">Description message</label>
    <input   value={formik.values.description}  onChange={formik.handleChange}  name="description"      placeholder="Enter Description"   className="input input focus:outline-none  h-24  bg-white  grow w-5/6"  id="leadingIconDefault" />
  </div>
  
        {formik.touched.description && formik.errors.description && (
              <div className="error">{formik.errors.description}</div>
            )}
        
    
            <p className="text-violet-500  mt-2  text-center">{message}</p> 
            <div className=" flex justify-end">
          <button
            className="  text-gray-600 rounded-md h-10 p-3 mr-3 hover:text-violet-600"
            onClick={toggleGroupModal}
          >
            Close
          </button>
          <button type="submit" disabled={submitting}   className="bg-violet-500 text-white h-10 p-2 rounded-md hover:bg-blue-600"   > Create Group</button>
         
        </div>
                 </form>
       
      </div>
    </div>
  );
};

export default GroupModal;