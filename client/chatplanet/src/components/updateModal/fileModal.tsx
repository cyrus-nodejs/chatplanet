import { ChatTabsContext } from "../../Context/chatTabs";
import { useContext,  useState, useEffect } from "react";
import { useAppSelector} from "../../Redux/app/hook";
import {  getUpdateMessage } from "../../Redux/features/updateProfile/updateProfileSlice";
import { useFormik } from 'formik';
import axios from "axios";
// import { getContactMessage} from "../../Redux/features/contacts/contactSlice";
import * as Yup from 'yup';

const FilesModal = () => {
  
     const message = useAppSelector(getUpdateMessage)
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const {updateProfileIMageModal, toggleProfileImageModal} = useContext(ChatTabsContext)

    
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
    image: File | null;
    title:string;
  }
  
  


  // Validation schema for the image field
  const validationSchema = Yup.object().shape({
    image: Yup.mixed<File>()
      .required("An image is required")
      .test("fileSize", "File size is too large. Max size is 1MB", value => !value || value.size <= 1024 * 1024) // Max size 1MB
      .test("fileType", "Unsupported file type", value => !value || ["image/jpg", "image/jpeg", "image/png"].includes(value?.type)),
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
         const formData = new FormData();
         formData.append('image', values.image as File);
         formData.append('title', values.title );
    console.log(values)
    console.log(formData)
        const response = await axios.post('http://localhost:5000/updateimage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
         withCredentials:true,
        });

        console.log('server response:', response.data);
     
      // Set submitting to false after successful submission
      setLoading(true)
      setSubmitting(false);
    } catch (error) {
      // Handle form submission error
      console.error(error);
      setSubmitting(false);
    }
  };
  // Formik hook for managing form state and handling submission
  const formik = useFormik({
    initialValues: {
      image: null,
      title:''
    },
    validationSchema,
    onSubmit: handleSubmit
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
  
  if (!updateProfileIMageModal) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleProfileImageModal}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Update Profile Image</h2>
       
        <div>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <div>
          <input
            id="image"
            name="image"
            type="file"
            accept=".png, .jpg, .jpeg, avif"
            onChange={handleFileChange}
            onBlur={formik.handleBlur}
            className='input grow input focus:outline-none h-10  bg-white w-5/6'
          />
          {formik.touched.image && formik.errors.image ? (
            <div style={{ color: 'red' }}>{formik.errors.image}</div>
          ) : null}
        </div>

        <div className="input-group border rounded bg-slate-50 max-w-sm">
   
   <label className="sr-only" htmlFor="leadingIconDefault">Phone Contact</label>
   <input   value={formik.values.title}  onChange={formik.handleChange}  name="title"      placeholder="Enter title "  className="input input focus:outline-none  h-12  bg-white  grow w-5/6"  id="leadingIconDefault" />
 </div>
 
       {formik.touched.title && formik.errors.title && (
             <div className="error">{formik.errors.title}</div>
           )}
        {/* Image preview */}
        {imagePreview && (
          <div>
            <h3>Image Preview:</h3>
            <img src={imagePreview} alt="Image Preview" style={{ width: '200px', height: 'auto' }} />
          </div>
        )}

        <button className='bg-violet-500 text-white h-10 p-2 mt-5 rounded-md hover:bg-blue-600' disabled={submitting} type="submit">
        {isLoading ? 'Loading…' : 'Update Profile Image'}
        </button>
        {message}
      </form>
    </div>
       
      </div>
    </div>
  );
};

export default FilesModal;