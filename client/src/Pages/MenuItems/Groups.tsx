
import { useContext, useEffect, useState } from "react"

import { ChatTabsContext } from "../../Context/chatTabs"
import { ChatContext } from "../../Context/chatContext"
import { useAppDispatch, useAppSelector } from "../../Redux/app/hook"
import { fetchGroups,fetchSearchGroup, getSearchResults, fetchGroupMembers, getGroupMembers,   getAllGroup  } from "../../Redux/features/groups/groupSlice"
import { GROUPMEMBERS, GROUPS } from "../../utils/types"
import { getAuthUser } from "../../Redux/features/auth/authSlice"

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { capitalizeFirstLetter } from "../../utils/helper"
const Groups = () => {

    interface FormValues {
    query: string;
  }

const { toggleGroupModal,  toggleAddContactToGroupModal } = useContext(ChatTabsContext)
 
const [submitting, setSubmitting] = useState(false);
  const { dispatch} = useContext(ChatContext)
  const reduxDispatch = useAppDispatch()
  const allGroups = useAppSelector(getAllGroup)
  const groupmembers = useAppSelector(getGroupMembers)
  const authUser = useAppSelector(getAuthUser)
  const searchresults = useAppSelector(getSearchResults) 

  const mygroup = allGroups.filter(group => group.createdby == authUser?.id )
  const othergroup = allGroups.filter(group => group.createdby !== authUser?.id )

 useEffect(() => {
  reduxDispatch(fetchGroups());
}, [reduxDispatch])

useEffect(() => {
  reduxDispatch(fetchGroupMembers());
}, [reduxDispatch])


  




  const validationSchema = Yup.object().shape({
   query: Yup.string()
    .min(1, 'Search term must be at least 1 characters')
    .required('Search term is required'),
   });

  const handleSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      reduxDispatch(fetchSearchGroup(values))
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
    <div id="tabs-vertical-4" className="" role="tabpanel" aria-labelledby="tabs-vertical-item-4">
      <div className="flex mt-4 justify-between " >
  <div className="text-left font-mono text-2xl text-slate-500">Groups</div>
  <div className='relative group'>
  <button
        className="px-3 py-3 bg-violet-600 text-white rounded-md hover:bg-violet-800"
        onClick={toggleGroupModal}
      >
        <i className='bx bx-group bx-sm'></i>
      </button>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
           Create 
         </div>
      </div>
      
</div>
  <form  onSubmit={formik.handleSubmit}>
<div className=' flex  w-full'>
<input name="query"  value={formik.values.query} onChange={formik.handleChange} className="mt-4 bg-gray-300 placeholder:text-green  w-5/6 m-2 h-8"  />
<button type="submit"  disabled={submitting}><i className='bx mt-5  bx-search text-slate-500'></i></button>
</div>

{formik.touched.query && formik.errors.query && (
            <div className="error text-xs">{formik.errors.query}</div>
          )}
    <ul>
            {searchresults ?  searchresults.map(group => (
              <li key={group.id} onClick={() => {dispatch({ type: 'SET_GROUP', payload: group }) }}>
                <img src={group.group_image} alt="" width="30" />
                {group.name}  
              </li>
            )): <span>No search results</span> }
          </ul>      
</form>
<h5 className='font-medium text-slate-500'>Group created by You</h5>
<div className='mt-4  h-32 overflow-hidden px-2 overflow-y-auto'>
{  mygroup?.map((group:GROUPS) =>
             (
              <div onClick={() => dispatch({ type: 'SET_GROUP', payload: group })} className="flex mt-8 justify-between">
              
              <div className=' font-medium  py-2 text-md text-slate-500'>{capitalizeFirstLetter(group.name.toLowerCase())}</div>
      
            <div className='relative group'>
             <button
          className="relative rounded-md px-3 py-3 bg-violet-600 text-white  hover:bg-violet-500"
          onClick={toggleAddContactToGroupModal}
        >
              <i className='bx bx-group bx-sm'></i>
        </button> 
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
             Add  
           </div> 
           </div>
           </div>
                )
         
  )}
  </div>
<h2 className='font-medium text-slate-500'>Other Groups</h2>
<div className=' h-32 overflow-hidden px-2 overflow-y-auto'>
  
{groupmembers?.map((user:GROUPMEMBERS) => (
      othergroup?.map((group:GROUPS) => (
            <div onClick={() => {dispatch({ type: 'SET_GROUP', payload: group })}} className="flex my-3 justify-between">
             <div className=' font-medium text-slate-500 py-2 text-md' >{user?.group_id === group?.id && (capitalizeFirstLetter(group.name.toLowerCase()) )}</div> 
         </div>
         )) 
              )
       )}




    

  
 

</div>

    </div>
  )
}

export default Groups