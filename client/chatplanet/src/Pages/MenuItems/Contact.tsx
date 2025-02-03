
import { useContext, useEffect } from "react"

import { ChatTabsContext } from "../../Context/chatTabs"

import { useAppDispatch, useAppSelector } from "../../Redux/app/hook"
import { fetchContacts,  getAllContacts } from "../../Redux/features/contacts/contactSlice"
// import { fetchPrivateMessage } from "../../Redux/features/messages/messageSlice"
import { CONTACTS } from "../../utils/types"
import { fetchAsyncUser } from "../../Redux/features/auth/authSlice"
 import { ChatContext } from "../../Context/chatContext"
const Contact = () => {
 // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
//  let data : any;
  const {toggleContactModal} = useContext(ChatTabsContext)
   const { setReceiver} = useContext(ChatContext)
 const dispatch = useAppDispatch()
 const allContacts = useAppSelector(getAllContacts)
  // const authUser = useAppSelector(getAuthUser)
 useEffect(() => {
  dispatch(fetchAsyncUser());
}, [dispatch])



 useEffect(() => {
  dispatch(fetchContacts());
}, [dispatch])


  return (
    <div id="tabs-vertical-5" className="" role="tabpanel" aria-labelledby="tabs-vertical-item-5">
      <div className="flex mt-4 justify-between " >
  <div className="text-lg">Contacts</div>
 <div><button
        className="px-3 py-3 bg-violet-500 text-white rounded-md hover:bg-violet-600"
        onClick={toggleContactModal}
      >
        <i className='bx bxs-user-plus bx-sm' ></i>
      </button></div>

</div>
<div className=' flex  w-full'>
<i className='bx mt-5 bx-search'></i>
<input className="   mt-4 bg-gray-300 placeholder:text-green  w-5/6 m-2 h-10"  />

</div>
{allContacts && (<div>
  {allContacts?.map((receiver:CONTACTS, id:number) =>{
          return (
        <div key={id} onClick={() => setReceiver(receiver) } className=" pt-8 text-left   w-full">#{receiver.firstname.toUpperCase()} {receiver.lastname.toUpperCase()} </div>
              )
       })}
</div>)}


    

    </div>
  )
}

export default Contact