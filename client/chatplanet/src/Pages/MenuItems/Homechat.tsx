

const Homechat = () => {
    return (
      <div id="tabs-vertical-1" className='' role="tabpanel" aria-labelledby="tabs-vertical-item-1">
        <p className="text-left font-mono text-2xl text-black-400">Chats</p>
        
        <div className=' flex mt-4 rounded'><input className="w-full h-10 border border-transparent rounded focus:outline-none  focus:ring-purple-600 focus:border-transparent focus: placeholder-gray-500   bg-gray-200" placeholder="Search messages or users"/></div>
        <div className=' flex mt-4 rounded' >
        <div className='relative ml-3 h-20 w-20 flex bg-slate-200' >
        <div className='absolute inset-x-0 mx-auto top-0 bg-slate-200 rounded-full h-9 w-9 flex' >
          profile-image
          </div>
          </div>
        </div>
  
        <p className="text-left font-mono text-2xl text-black-400">Recent</p>
  
        <div className="flex ">
    <div className="flex-none w-16 h-16  bg-slate-200 rounded-full  flex">
       This item will not grow 
    </div>
    <div className="flex-grow h-16 px-3">
      About
    </div>
    <div className="flex-none w-16 h-16 ...">
    Time
    </div>
  </div>
        </div>
    )
  }
  
  export default Homechat