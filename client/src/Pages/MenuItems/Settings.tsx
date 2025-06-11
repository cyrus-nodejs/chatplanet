import { fetchAsyncUser, getAllUsers, getAuthUser } from "../../Redux/features/auth/authSlice"
import { useAppSelector, useAppDispatch } from "../../Redux/app/hook"
import { useEffect, useState } from "react"
import { convertTimestampDate,capitalizeFirstLetter, convertTimestampToTime } from "../../utils/helper"
const Settings = () => {
const dispatch = useAppDispatch()
const authUser = useAppSelector( getAuthUser)
const allUsers = useAppSelector(getAllUsers)

const myuser  = allUsers.filter(users=> users.id ===authUser?.id)

console.log(myuser)
useEffect(() => {
  dispatch(fetchAsyncUser)

}, [dispatch]);
 
const [isOpen1, setIsOpen1] = useState(false);
const [isOpen2, setIsOpen2] = useState(false);
const [isOpen3, setIsOpen3] = useState(false);
const [isOpen4, setIsOpen4] = useState(false);

  const toggleCollapse1 = () => {
    setIsOpen1(!isOpen1);
  };
  const toggleCollapse2 = () => {
    setIsOpen2(!isOpen2);
  };

  const toggleCollapse3 = () => {
    setIsOpen3(!isOpen3);
  };

  const toggleCollapse4 = () => {
    setIsOpen4(!isOpen4);
  };



  return (
    <div className='' >
<div className="flex mt-4 justify-between " >
  <div className="text-xl text-slate-500">Settings</div>

</div>

<div  className="bg-cover bg-center  rounded-full  w-32 h-32 bg-slate-400 m-auto"
  style={{ backgroundImage: `url(${myuser[0].profile_image})` }}>
  
</div>


  <p className='text-lg text-center text-slate-500'>{capitalizeFirstLetter(myuser[0]?.firstname.toLowerCase())}</p>
  <p className='text-lg text-center text-green-500 '>{myuser[0]?.status}</p>


<div className='overflow-y-auto h-64'>
  <div className="  flex-col    mt-4 w-full ">
  <div  className="border flex justify-between  w-full "  >
  <div className="icon-[tabler--chevron-down] m-3 dropdown-open:rotate-180 size-4 text-slate-500">Personal </div> 
    <div  className="icon-[tabler--chevron-down] flex  m-3  size-4"><i onClick={toggleCollapse1} className={`bx bx-chevron-down ${
          isOpen1 ? 'rotate-180' : ''}  `}></i></div>
  </div>
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen1 ? 'max-h-96  w-full' : 'max-h-0'
        }   rounded-b-md`}  role="menu" aria-orientation="vertical" aria-labelledby="dropdown-default">
    <div className="grid grid-flow-row auto-rows-max  my-2 " >
      <div className='text-slate-500'>Name</div>
    <div className="text-sm text-slate-500">{capitalizeFirstLetter(myuser[0]?.firstname.toLowerCase())} {capitalizeFirstLetter(myuser[0]?.lastname.toLowerCase())}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max  my-4">
    <div className='text-slate-500'>Email</div>
    <div className="text-sm text-slate-500">{myuser[0]?.email}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
    <div className='text-slate-500'>Created on</div>
    <div className="text-sm text-slate-500">{convertTimestampDate(myuser[0]?.date_created)}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
      <div className='text-slate-500'>Location</div>
    <div className="text-sm text-slate-500">{myuser[0]?.country}</div>
    </div>
  </div>
</div>


<div className="  flex-col    mt-4 w-full ">
  <div id="dropdown-default"  className="border flex justify-between  w-full " aria-haspopup="menu" >
  <div className="icon-[tabler--chevron-down] m-3 dropdown-open:rotate-180 size-4 text-slate-500"> Privacy</div> 
    <div  className="icon-[tabler--chevron-down] flex  m-3 dropdown-open:rotate-180 size-4"><i onClick={toggleCollapse2} className={`bx bx-chevron-down ${
          isOpen2 ? 'rotate-180' : ''}  `}></i></div>
  </div>
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen2 ? 'max-h-96  w-full' : 'max-h-0'
        }   rounded-b-md`}  role="menu" aria-orientation="vertical" aria-labelledby="dropdown-default">
    <div className="grid grid-flow-row auto-rows-max  my-2 " >
      <div className='text-slate-500 '>Profile Photo</div>
      <div className="">{<img src={myuser[0].profile_image} height='50' width='50'/>}</div>
      <div className='flex justify-center'>
   
    <div className='text-slate-500'>Hide Photo</div>
    </div>
    </div>
    <div className="grid grid-flow-row auto-rows-max  my-4">
    <div className='text-slate-500'>Last Seen</div>
    <div className="text-sm text-slate-500">{convertTimestampToTime(myuser[0]?.last_seen)}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
    <div className='text-slate-500'>Status</div>
    <div className="text-sm text-green-500">{authUser ? ('online'): ('offline')}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
      <div className='text-slate-500'>Read Receipts</div>
    <div className=""></div>
    </div>
  </div>
</div>

<div className="  flex-col    mt-4 w-full ">
  <div id="dropdown-default"  className="border flex justify-between  w-full " aria-haspopup="menu" >
  <div className="icon-[tabler--chevron-down] m-3 dropdown-open:rotate-180 size-4 text-slate-500">Security</div> 
    <div  className="icon-[tabler--chevron-down] flex  m-3 dropdown-open:rotate-180 size-4"><i onClick={toggleCollapse3} className={`bx bx-chevron-down ${
          isOpen3 ? 'rotate-180' : ''}  `}></i></div>
  </div>
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen3 ? 'max-h-96  w-full' : 'max-h-0'
        }   rounded-b-md`}  role="menu" aria-orientation="vertical" aria-labelledby="dropdown-default">
    <div className="grid grid-flow-row auto-rows-max  my-2 " >
      <div className='text-slate-500'>Show security notification</div>
    <div className=""></div>
    </div>
  </div>
</div>

<div className="  flex-col    mt-4 w-full ">
  <div  className="border flex justify-between  w-full "  >
  <div  className="icon-[tabler--chevron-down] m-3 dropdown-open:rotate-180 size-4  text-slate-500">Help</div> 
    <div  className="icon-[tabler--chevron-down] flex  m-3 dropdown-open:rotate-180 size-4"><i onClick={toggleCollapse4} className={`bx bx-chevron-down ${
          isOpen4 ? 'rotate-180' : ''}  `}></i></div>
  </div>
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen4 ? 'max-h-96  w-full' : 'max-h-0'
        }  rounded-b-md`} >
    <div className="grid grid-flow-row auto-rows-max  my-2 " >
      <div className='text-slate-500'>FAQ</div>

    </div>
    <div className="grid grid-flow-row auto-rows-max  my-4">
    <div className='text-slate-500'>Contact</div>
    <div className="text-sm text-slate-500">{myuser[0]?.email}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
    <div className='text-slate-500'>Terms & Privacy Policy</div>
    <div className=""></div>
    </div>
  </div>
</div>
    </div>
    </div>
  )
}

export default Settings