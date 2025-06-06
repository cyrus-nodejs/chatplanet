/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useContext, useEffect } from "react"

import { ChatTabsContext } from "../../Context/chatTabs"

import { useAppDispatch, useAppSelector } from "../../Redux/app/hook"
import { fetchContacts,  getAllContacts } from "../../Redux/features/contacts/contactSlice"
 import { fetchAddRecentChat } from "../../Redux/features/messages/messageSlice"
import { CONTACTS } from "../../utils/types"
import { fetchAsyncUser } from "../../Redux/features/auth/authSlice"
 import { ChatContext } from "../../Context/chatContext"
 import { capitalizeFirstLetter } from "../../utils/helper"
const Contact = () => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let data:any
  const {toggleContactModal} = useContext(ChatTabsContext)
   const { setReceiver} = useContext(ChatContext)
 const dispatch = useAppDispatch()
 const allContacts = useAppSelector(getAllContacts)
  
 useEffect(() => {
  dispatch(fetchAsyncUser());
}, [dispatch])



 useEffect(() => {
  dispatch(fetchContacts());
}, [dispatch])


  return (
    <div id="tabs-vertical-5" className="" role="tabpanel" aria-labelledby="tabs-vertical-item-5">
      <div className="flex mt-4 justify-between " >
  <div className="text-left font-mono text-2xl text-slate-500">Contacts</div>
 <div className='relative group'><button
        className="px-3 py-3 bg-violet-600 text-white rounded-md hover:bg-violet-800"
        onClick={toggleContactModal}
      >
        <i className='bx bxs-user-plus bx-sm' ></i>
      </button>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white  dark:bg-gray-800  dark:text-white text-sm rounded px-2 py-1">
           Add
         </div>
      </div>

</div>
<div className=' flex  w-full'>
<i className='bx mt-5 bx-search text-slate-500'></i>
<input className="   mt-4 bg-gray-300 placeholder:text-green  w-5/6 m-2 h-10"  />

</div>
<div className='h-64 overflow-hidden overflow-y-auto justify-between'>
{allContacts && (<div>
  {allContacts?.map((receiver:CONTACTS, id:number) =>{
          return (
        <div key={id} onClick={() => {setReceiver(receiver); dispatch(fetchAddRecentChat(data={receiver})) }} className=" pt-3 text-left font-medium text-slate-500  w-full">{capitalizeFirstLetter(receiver.firstname.toLowerCase())} {capitalizeFirstLetter(receiver.lastname.toLowerCase())} </div>
              )
       })}
</div>)}
</div>

    

    </div>
  )
}

export default Contact