import { ChatTabsContext } from "../../Context/chatTabs";
import { useContext, useEffect,   useState } from "react";
import { useAppSelector } from "../../Redux/app/hook";
import axios from "axios";
import { useFormik } from 'formik';
import { getGroupMessage} from "../../Redux/features/groups/groupSlice";
import * as Yup from 'yup';
import {  getAllContacts } from "../../Redux/features/contacts/contactSlice";

const GroupModal = () => {


    const message = useAppSelector(getGroupMessage)
    const allContacts = useAppSelector(getAllContacts)
    console.log(allContacts)
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const {isGroupModalOpen, toggleGroupModal} = useContext(ChatTabsContext)

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
    name:string,
    description: string
    image: File | null;
    
  }
  
  
  
  
    const validationSchema = Yup.object().shape({
     name: Yup.string(),
     description: Yup.string(),
     image: Yup.mixed<File>()
           .required("An image is required")
           .test("fileSize", "File size is too large. Max size is 1MB", value => !value || value.size <= 1024 * 1024) // Max size 1MB
           .test("fileType", "Unsupported file type", value => !value || ["image/jpg", "image/jpeg", "image/png", "image/avif"].includes(value?.type)),
       
     });
  
    const handleSubmit = async (values: FormValues) => {
      try {
        setSubmitting(true);
        const formData = new FormData();
         formData.append('image', values.image as File);
         formData.append('name', values.name );
         formData.append('description', values.description );

    console.log(values)
    console.log(formData)
        const response = await axios.post('http://localhost:5000/creategroup', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
         withCredentials:true,
        });

        console.log('server response:', response.data);
     
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
        description: '',
        name:"",
        image: null,
      },
      validationSchema,
      onSubmit: handleSubmit,
    });
   // Handle file input change to preview image and set Formik field value

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    formik.setFieldValue('image', file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  if (!isGroupModalOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleGroupModal}
    >
      <div
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
       
        <form className=' p-6' onSubmit={formik.handleSubmit}>
              
              <div className="input-group border rounded max-w-sm">
  
    <label className="sr-only" htmlFor="leadingIconDefault">Group Name</label>
    <input   value={formik.values.name} onChange={formik.handleChange}  name="name"   type="name" placeholder="Enter Group Name"   className="input grow input focus:outline-none h-10  bg-white dark:bg-gray-800 text-black dark:text-white w-full"  id="leadingIconDefault" />
  </div>
      
        {formik.touched.name && formik.errors.name && (
              <div className="error ">{formik.errors.name}</div>
            )}
       
        <br />
       
        <div className="input-group border rounded  max-w-sm">
   
    <label className="sr-only" htmlFor="leadingIconDefault">Description message</label>
    <input   value={formik.values.description}  onChange={formik.handleChange}  name="description"      placeholder="Enter Description"   className="input input focus:outline-none    bg-white  dark:bg-gray-800 text-black dark:text-white w-full"  id="leadingIconDefault" />
  </div>
  
        {formik.touched.description && formik.errors.description && (
              <div className="error">{formik.errors.description}</div>
            )}
        
        <div className='py-3'>
          <input
            id="image"
            name="image"
            type="file"
            accept=".png, .jpg, .jpeg, avif"
            onChange={handleFileChange}
            onBlur={formik.handleBlur}
            className='input grow input focus:outline-none h-10  '
          />
          {formik.touched.image && formik.errors.image ? (
            <div style={{ color: 'red' }}>{formik.errors.image}</div>
          ) : null}
        </div>
            {/* Image preview */}
            {imagePreview && (
          <div>
            <h3>Image Preview:</h3>
            <img src={imagePreview} alt="Image Preview" style={{ width: '100px', height: '150px' }} />
          </div>
        )}
            <p className="text-violet-500  mt-2  text-center">{message}</p> 
            <div className=" flex justify-end">
          <button
            className="  text-gray-600 rounded-md h-10 p-3 mr-3 hover:text-violet-600"
            onClick={toggleGroupModal}
          >
            Close
          </button>
          <button type="submit" disabled={submitting}   className="bg-violet-500 text-white h-10 p-2 rounded-md hover:bg-blue-600"   > 
          {isLoading ? 'Loading…' : 'Create Group'}
          </button>
         
        </div>
                 </form>
       
      </div>
    </div>
  );
};

export default GroupModal;