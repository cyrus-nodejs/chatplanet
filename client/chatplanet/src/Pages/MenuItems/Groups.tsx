
import { useContext, useEffect } from "react"
// import Avatar from 'react-avatar';
import { ChatTabsContext } from "../../Context/chatTabs"
import { ChatContext } from "../../Context/chatContext"
import { useAppDispatch, useAppSelector } from "../../Redux/app/hook"
import { fetchGroups,   getAllGroup  } from "../../Redux/features/groups/groupSlice"
import { GROUPS } from "../../utils/types"

const Groups = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let data;
  const { toggleGroupModal, toggleAddContactToGroupModal } = useContext(ChatTabsContext)
  const {setGroup} = useContext(ChatContext)
 const dispatch = useAppDispatch()
  const allGroups = useAppSelector(getAllGroup)

 useEffect(() => {
  dispatch(fetchGroups());
}, [dispatch])

  return (
    <div id="tabs-vertical-4" className="" role="tabpanel" aria-labelledby="tabs-vertical-item-4">
      <div className="flex mt-4 justify-between " >
  <div className="text-lg">Groups</div>
  <div className='relative group'>
  <button
        className="px-3 py-3 bg-purple-400 text-white rounded-md hover:bg-purple-600"
        onClick={toggleGroupModal}
      >
        <i className='bx bx-group bx-sm'></i>
      </button></div>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-sm rounded px-2 py-1">
           Create new Group
         </div>
</div>
<div className=' flex  w-full'>
<i className='bx mt-5 bx-search'></i>
<input className="   mt-4 bg-gray-300 placeholder:text-green  w-5/6 m-2 h-6"  />

</div>

<div className='mt-4 pt-4'>
  
{allGroups && (<div>
  {allGroups?.map((group:GROUPS) =>{
          return (
            <div onClick={() => setGroup(group)} className="flex  justify-between">
            <div key={group.id} >
            <img width="50px" height="50px"  src="https://img.freepik.com/premium-photo/ai-generated-images-build-user-profile-page_1290175-101.jpg" />
            <strong>{group.name}</strong>
          </div>
          <div className='relative group'>
          <button
        className="relative rounded-md hover:bg-purple-600"
        onClick={toggleAddContactToGroupModal}
      >
        Add
      </button>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-sm rounded px-2 py-1">
           Add user to {group.name}
         </div>
         </div>
         </div>
              )
       })}
</div>)}


    

  
 

</div>

    </div>
  )
}

export default Groups