
import { useContext, useEffect } from "react"
// import Avatar from 'react-avatar';
import { ChatTabsContext } from "../../Context/chatTabs"
import { ChatContext } from "../../Context/chatContext"
import { useAppDispatch, useAppSelector } from "../../Redux/app/hook"
import { fetchGroups, fetchGroupMembers, getGroupMembers,   getAllGroup  } from "../../Redux/features/groups/groupSlice"
import { GROUPMEMBERS, GROUPS } from "../../utils/types"
import { getAuthUser, fetchAsyncUser } from "../../Redux/features/auth/authSlice"
// import AddGroupContactModal from "../../components/modal/AddGroupContactModal"
import { capitalizeFirstLetter } from "../../utils/helper"
const Groups = () => {


const { toggleGroupModal, toggleAddContactToGroupModal } = useContext(ChatTabsContext)
  const {setGroup} = useContext(ChatContext)
 const dispatch = useAppDispatch()
  const allGroups = useAppSelector(getAllGroup)
  const groupmembers = useAppSelector(getGroupMembers)
  const authUser = useAppSelector(getAuthUser)
  console.log(groupmembers)
console.log(allGroups)
const mygroup = allGroups.filter(group => group.createdby == authUser?.id )
const othergroup = allGroups.filter(group => group.createdby !== authUser?.id )

 useEffect(() => {
  dispatch(fetchGroups());
}, [dispatch])
useEffect(() => {
  dispatch(fetchAsyncUser());
}, [dispatch])
useEffect(() => {
  dispatch(fetchGroupMembers());
}, [dispatch])

console.log(mygroup)
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
<div className=' flex  w-full'>
<i className='bx mt-5 bx-search text-slate-500'></i>
<input className="   mt-4 bg-gray-300 placeholder:text-green  w-5/6 m-2 h-6"  />

</div>

<h5 className='font-medium text-slate-500'>Group created by You</h5>
<div className='mt-4  h-32 overflow-hidden px-2 overflow-y-auto'>
{  mygroup?.map((group:GROUPS) =>
             (
              <div onClick={() => {setGroup(group)}} className="flex mt-8 justify-between">
              
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
            <div onClick={() => {setGroup(group)}} className="flex my-3 justify-between">
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