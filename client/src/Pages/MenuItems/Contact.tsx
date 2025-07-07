
import { useContext, useEffect, useState } from "react"
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { ChatTabsContext } from "../../Context/chatTabs"

import { useAppDispatch, useAppSelector } from "../../Redux/app/hook"
import { fetchContacts, fetchSearchContact, getSearchResults,  getAllContacts } from "../../Redux/features/contacts/contactSlice"
 import { fetchAddRecentChat } from "../../Redux/features/messages/messageSlice"
import { CONTACTS } from "../../utils/types"
import { fetchAsyncUser } from "../../Redux/features/auth/authSlice"
 import { ChatContext } from "../../Context/chatContext"
 import { capitalizeFirstLetter } from "../../utils/helper"

const Contact = () => {

  interface FormValues {
    query: string;
  }
   
  
   let data;
   console.log(data)



  const {toggleContactModal} = useContext(ChatTabsContext)
   const {  dispatch} = useContext(ChatContext)
 const reduxdispatch = useAppDispatch()
 const allContacts = useAppSelector(getAllContacts)
 const searchresults =  useAppSelector(getSearchResults)
  
 useEffect(() => {
  reduxdispatch(fetchAsyncUser());
}, [reduxdispatch])



 useEffect(() => {
  reduxdispatch(fetchContacts());
}, [reduxdispatch])



  

      
  // const message = useAppSelector(getMessage)

const [hidden, setHidden] = useState(true)
  const [submitting, setSubmitting] = useState(false);


  const hideSearchResult = () => {
    setHidden(!hidden)
  }


  const validationSchema = Yup.object().shape({
   query: Yup.string()
    .min(1, 'Search term must be at least 1 characters')
    .required('Search term is required'),
   });

  const handleSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      reduxdispatch(fetchSearchContact(values))
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
      query: ''
    },
    validationSchema,
    onSubmit: handleSubmit,
  });


  return (
    <div id="tabs-vertical-5" className="" role="tabpanel" aria-labelledby="tabs-vertical-item-5">
      <div className="flex mt-4 justify-between " >
  <div className="text-left font-mono text-2xl text-slate-500">Contacts</div>
 <div className='relative group'><button
        className="px-3 py-3 bg-slateBlue text-white rounded-md hover:bg-violet-800"
        onClick={toggleContactModal}
      >
        <i className='bx bxs-user-plus bx-sm' ></i>
      </button>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">
           Add
         </div>
      </div>

</div>
  <form  onSubmit={formik.handleSubmit}>

<div className=' flex  w-full'>
<input type='text'  name="query"  value={formik.values.query} onChange={formik.handleChange} className="   mt-4 bg-gray-300  placeholder:text-green  w-5/6 m-2 h-8"  />
<button type="submit"  disabled={submitting}><i className='bx mt-5  bx-search text-slate-500'></i></button>
</div>

{formik.touched.query && formik.errors.query && (
            <div className="error text-xs text-slate-500">{formik.errors.query}</div>
          )}

<ul onClick={hideSearchResult}>
        {hidden  &&  (searchresults.map(user => (
          <li className='text-slate-500' key={user.id} onClick={() => {dispatch({ type: 'SET_RECEIVER', payload: user }) }}>
            <img src={user.profile_image} alt="" width="30" />
            {user.firstname}  {user.lastname}
          </li>
        ))) }
      </ul>
     </form>
<div className='h-64 overflow-hidden overflow-y-auto justify-between'>
{allContacts && (<div>
  {allContacts?.map((receiver:CONTACTS, id:number) =>{
          return (  
        <div key={id} onClick={() => {dispatch({ type: 'SET_RECEIVER', payload: receiver }); reduxdispatch(fetchAddRecentChat(data ={ receiver })) }} className=" pt-3 text-left font-medium text-slate-500  w-full">{capitalizeFirstLetter(receiver.firstname.toLowerCase())} {capitalizeFirstLetter(receiver.lastname.toLowerCase())} </div>
              )
       })}
</div>)}
</div>

    

    </div>
  )
}

export default Contact