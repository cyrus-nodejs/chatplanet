import { ChatTabsContext } from "../../Context/chatTabs";
import { useContext, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/app/hook";
import { CONTACTS } from "../../utils/types";
import { getGroupMessage} from "../../Redux/features/groups/groupSlice";
import { ChatContext } from "../../Context/chatContext";
import {  getAllContacts, fetchContacts } from "../../Redux/features/contacts/contactSlice";
import { fetchAddGroupMembers } from "../../Redux/features/groups/groupSlice";
const AddGroupContactModal = () => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let data;
    const dispatch = useAppDispatch()
    const message = useAppSelector(getGroupMessage)
    const allContacts = useAppSelector(getAllContacts)

   
   const {group} = useContext(ChatContext)

    const {isAddContactToGroupModalOpen, toggleAddContactToGroupModal} = useContext(ChatTabsContext)
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
    useEffect(() => {
    
      dispatch(fetchContacts());
    
    }, [dispatch, ])
    

   

  
  if (!isAddContactToGroupModalOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleAddContactToGroupModal}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Add Contacts to group</h2>
       
        {allContacts && (<div>
  {allContacts?.map((contact:CONTACTS, id:number) =>{
          return (
            <div className='flex justify-between'>
        <div key={id}  className="text-violet-500 p-3 text-left font-semibold w-full">{contact.firstname.toUpperCase()} {contact.lastname.toUpperCase()} </div>
        <i onClick={() => {dispatch(fetchAddGroupMembers(data={group, contact}))}} className='bx bx-add-to-queue text-purple-500'></i>

             </div>
              )
       })}
</div>)}

    
            <p className="text-violet-500  mt-2  text-center">{message}</p> 
            <div className=" flex justify-end">
          <button
            className="  text-gray-600 rounded-md h-10 p-3 mr-3 hover:text-violet-600"
            onClick={toggleAddContactToGroupModal}
          >
            Close
          </button>
         
         
        </div>
                 
       
      </div>
    </div>
  );
};

export default AddGroupContactModal;