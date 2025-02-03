import { fetchAsyncUser, getAuthUser } from "../../Redux/features/auth/authSlice"
import { useAppSelector, useAppDispatch } from "../../Redux/app/hook"
import { useEffect, useState } from "react"

const Settings = () => {
const dispatch = useAppDispatch()
const authUser = useAppSelector( getAuthUser)

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


   // Data for collapsible items
  //  const items = [
  //   { id: 1, title: 'Personal', content: 'Content for Item 1' },
  //   { id: 2, title: 'Privacy', content: 'Content for Item 2' },
  //   { id: 3, title: 'Security', content: 'Content for Item 3' },
  //   { id: 4, title: 'Help', content: 'Content for Item 4' },
  // ];

  return (
    <div >
<div className="flex mt-4 justify-between " >
  <div className="text-xl">Settings</div>

</div>

<div className="bg-[url('https://img.freepik.com/premium-photo/ai-generated-images-build-user-profile-page_1290175-101.jpg')] bg-cover bg-center  rounded-full  w-32 h-32 bg-slate-400 m-auto">
  
</div>


  <p className='text-lg text-center'>{authUser?.firstname.toUpperCase()}</p>
  <p className='text-lg text-center '>{authUser?.status}</p>


  <div className="  flex-col    mt-4 w-full ">
  <div  className="border flex justify-between  w-full "  >
  <div className="icon-[tabler--chevron-down] m-3 dropdown-open:rotate-180 size-4 bg-white"><i className='bx mr-3 bx-user' >Personal </i></div> 
    <div  className="icon-[tabler--chevron-down] flex  m-3  size-4"><i onClick={toggleCollapse1} className={`bx bx-chevron-down ${
          isOpen1 ? 'rotate-180' : ''}  `}></i></div>
  </div>
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen1 ? 'max-h-96 bg-white w-full' : 'max-h-0'
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


<div className="  flex-col    mt-4 w-full ">
  <div id="dropdown-default"  className="border flex justify-between  w-full " aria-haspopup="menu" >
  <div className="icon-[tabler--chevron-down] m-3 dropdown-open:rotate-180 size-4 bg-white"><i className='bx mr-3 bx-user' >Privacy</i></div> 
    <div  className="icon-[tabler--chevron-down] flex  m-3 dropdown-open:rotate-180 size-4"><i onClick={toggleCollapse2} className={`bx bx-chevron-down ${
          isOpen2 ? 'rotate-180' : ''}  `}></i></div>
  </div>
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen2 ? 'max-h-96 bg-white w-full' : 'max-h-0'
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

<div className="  flex-col    mt-4 w-full ">
  <div id="dropdown-default"  className="border flex justify-between  w-full " aria-haspopup="menu" >
  <div className="icon-[tabler--chevron-down] m-3 dropdown-open:rotate-180 size-4 bg-white"><i className='bx mr-3 bx-user' >Security</i></div> 
    <div  className="icon-[tabler--chevron-down] flex  m-3 dropdown-open:rotate-180 size-4"><i onClick={toggleCollapse3} className={`bx bx-chevron-down ${
          isOpen3 ? 'rotate-180' : ''}  `}></i></div>
  </div>
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen3 ? 'max-h-96 bg-white w-full' : 'max-h-0'
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

<div className="  flex-col    mt-4 w-full ">
  <div  className="border flex justify-between  w-full "  >
  <div className=" m-3  size-4 ">Help</div> 
    <div  className=""><i onClick={toggleCollapse4} className={`bx bx-chevron-down ${
          isOpen4 ? 'rotate-180' : ''}  `}></i></div>
  </div>
  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen4 ? 'max-h-96 bg-white w-full' : 'max-h-0'
        } bg-gray-100 p-4 rounded-b-md`} >
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

export default Settings