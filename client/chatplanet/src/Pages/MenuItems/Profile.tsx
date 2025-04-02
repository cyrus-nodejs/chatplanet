import { getAuthUser, fetchAsyncUser } from "../../Redux/features/auth/authSlice"
import { useEffect, useContext, useState  } from "react"
import { useAppDispatch, useAppSelector } from "../../Redux/app/hook"
import { ChatTabsContext } from "../../Context/chatTabs"
import { getAllUsers, fetchAllUsers } from "../../Redux/features/auth/authSlice"
import { convertTimestampDate, capitalizeFirstLetter } from "../../utils/helper"

const Profile = () => {
  const dispatch = useAppDispatch()
  const authUser = useAppSelector(getAuthUser)
  const allUsers = useAppSelector(getAllUsers)
  const [isOpen, setIsOpen] = useState(false);
  const {toggleProfileImageModal, toggleBioModal, toggleLocationModal, toggleMobileModal} = useContext(ChatTabsContext)
  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const myuser  = allUsers.filter(users=> users.id ===authUser?.id)

console.log(myuser)
  
 useEffect(() => {
    
  dispatch(fetchAllUsers());

}, [dispatch])

 useEffect(() => {
    
  dispatch(fetchAsyncUser());

}, [dispatch])

  return (
    <div id="" >
<div className="flex mt-4 justify-between " >
  <div className="text-left font-mono text-2xl text-black-400">My Profile</div>
  <div><i className='bx bx-dots-vertical-rounded' ></i></div>
</div>

<div
 style={{ backgroundImage: `url(${myuser[0]?.profile_image})` }}
 className=" bg-cover bg-center  rounded-full  w-32 h-32 bg-slate-400 m-auto">
</div>


  <p className='text-md font-medium text-center'>{capitalizeFirstLetter(myuser[0]?.firstname.toLowerCase())} {capitalizeFirstLetter(myuser[0]?.lastname.toLowerCase())}</p>
  <p className='text-sm text-slate-500 text-center '>{myuser[0]?.status && ('Active')}</p>

<p className='text-sm text-center text-slate-500 m-auto' >
{myuser[0]?.about}
</p>
<div className="  flex-col    mt-4 w-full ">
  <div id="dropdown-default"  className="border flex justify-between   w-full " aria-haspopup="menu" >
  <div className="icon-[tabler--chevron-down] m-3 dropdown-open:rotate-180 size-4"><i className='bx mr-3 bx-user font-medium' >About</i></div> 
    <div  className="icon-[tabler--chevron-down] flex  m-3 dropdown-open:rotate-180 size-4"><i onClick={toggleCollapse} className={`bx bx-chevron-down ${
          isOpen ? 'rotate-180' : ''}  `}></i></div>
  </div>
  
  <div className={`overflow-hidden flex transition-all duration-300 ease-in-out ${
          isOpen ? 'h-64 overflow-y-auto   w-full  ' : 'max-h-0'
        } `}  role="menu" aria-orientation="vertical" aria-labelledby="dropdown-default">
          <div className='max-h-screen flex-1 px-4 py-4 overflow-y-auto space-y-4 '>
    <div className="grid grid-flow-row auto-rows-max  my-2 " >
      <div className='text-slate-500'>Name</div>
    <div className="text-sm ">{myuser[0]?.firstname.toUpperCase()} {myuser[0]?.lastname.toUpperCase()}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max  my-4">
    <div className='text-slate-500'>Email</div>
    <div className=" text-sm ">{myuser[0]?.email}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
    <div className=''></div>
    <div className=" text-sm ">{convertTimestampDate(myuser[0]?.last_seen)}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
      <div className='flex  justify-between'> 
    <div className='text-slate-500'>Profile Photo</div>
    <div className='text-slate-500 text-sm' onClick={toggleProfileImageModal}>Edit </div>
    </div>
    <img src={myuser[0]?.profile_image} alt='Profile'  width="25" height="25"/>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
    <div className='flex  justify-between'> 
    <div className='text-slate-500'>Bio</div>
    <div className='text-slate-500 text-sm' onClick={toggleBioModal}>Edit </div>
    </div>
    <div className="text-sm ">{myuser[0]?.about}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
    <div className='flex  justify-between'> 
    <div className='text-slate-500'>Phone No</div>
    <div className='text-slate-500 text-sm' onClick={toggleMobileModal}>Edit </div>
    </div>
    <div className="text-sm ">{myuser[0]?.mobile}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
    <div className='flex  justify-between'> 
      <div className='text-slate-500'>Location</div>
      <div className='text-slate-500 text-sm' onClick={toggleLocationModal}>Edit </div>
      </div>
    <div className="text-sm ">{myuser[0]?.country}</div>
    </div>
  </div>
</div>
</div>
    </div>
  )
}

export default Profile