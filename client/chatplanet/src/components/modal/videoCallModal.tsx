import { ChatTabsContext } from "../../Context/chatTabs";
import { ChatContext } from "../../Context/chatContext";
import { useContext,   } from "react";





const VideoCallModal = () => {

    const {isVideoCallModalOpen, toggleVideoCallModal} = useContext(ChatTabsContext)
  const {receiver} = useContext(ChatContext)
  
 
  if (!isVideoCallModalOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleVideoCallModal}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="bg-[url('https://img.freepik.com/premium-photo/ai-generated-images-build-user-profile-page_1290175-101.jpg')] bg-cover bg-center  rounded-full  w-32 h-32 bg-slate-400 m-auto">

</div>

<p className='text-lg text-center'> {receiver?.firstname.toUpperCase()} </p>

<p className='text-lg text-center font-semibold'> Start video call </p>
<div className="flex mx-24 mt-8 space-x-4 " >
    <div    onClick={toggleVideoCallModal}  className="bg-red-600 rounded-full p-8 text-white font-bold text-lg  space-x-4 w-20 h-20">X</div>
    <div  className="bg-green-600 rounded-full  w-20 h-20"><i className='bx bx-sm p-8 text-white bxs-phone-call'></i></div>
 </div>
      </div>
    </div>
  );
};

export default VideoCallModal;