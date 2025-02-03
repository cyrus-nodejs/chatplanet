import { getAuthUser, fetchAsyncUser } from "../../Redux/features/auth/authSlice"
import { useEffect, useState  } from "react"
import { useAppDispatch, useAppSelector } from "../../Redux/app/hook"

const Profile = () => {
  const dispatch = useAppDispatch()
  const authUser = useAppSelector(getAuthUser)
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };


 useEffect(() => {
    
  dispatch(fetchAsyncUser());

}, [dispatch])

  return (
    <div id="">
<div className="flex mt-4 justify-between " >
  <div className="text-2xl font-mono font-bold">My Profile</div>
  <div><i className='bx bx-dots-vertical-rounded' ></i></div>
</div>

<div className="bg-[url('https://img.freepik.com/premium-photo/ai-generated-images-build-user-profile-page_1290175-101.jpg')] bg-cover bg-center  rounded-full  w-32 h-32 bg-slate-400 m-auto">

</div>


  <p className='text-lg text-center'>{authUser?.firstname.toUpperCase()} {authUser?.lastname.toUpperCase()}</p>
  <p className='text-lg text-center '>{authUser?.status}</p>

<p className='text-md m-auto' >
If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual.
</p>
<div className="  flex-col    mt-4 w-full ">
  <div id="dropdown-default"  className="border flex justify-between  w-full " aria-haspopup="menu" >
  <div className="icon-[tabler--chevron-down] m-3 dropdown-open:rotate-180 size-4 bg-white"><i className='bx mr-3 bx-user' >About</i></div> 
    <div  className="icon-[tabler--chevron-down] flex  m-3 dropdown-open:rotate-180 size-4"><i onClick={toggleCollapse} className={`bx bx-chevron-down ${
          isOpen ? 'rotate-180' : ''}  `}></i></div>
  </div>
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 bg-white w-full' : 'max-h-0'
        } bg-gray-100 p-4 rounded-b-md`}  role="menu" aria-orientation="vertical" aria-labelledby="dropdown-default">
    <div className="grid grid-flow-row auto-rows-max  my-2 " >
      <div className=''>Name</div>
    <div className="">{authUser?.firstname.toUpperCase()} {authUser?.lastname.toLowerCase()}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max  my-4">
    <div className=''>Email</div>
    <div className="">{authUser?.email}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
    <div className=''>Time</div>
    <div className="">{Date.now()}</div>
    </div>
    <div className="grid grid-flow-row auto-rows-max my-4">
      <div className=''>Location</div>
    <div className="">{authUser?.country}</div>
    </div>
  </div>
</div>

    </div>
  )
}

export default Profile