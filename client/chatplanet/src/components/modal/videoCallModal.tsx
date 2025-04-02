import { ChatTabsContext } from "../../Context/chatTabs";
import { ChatContext } from "../../Context/chatContext";
import { useContext,   } from "react";
import  { useEffect, useRef, useState } from 'react';
import io from  'socket.io-client';



const SOCKET_SERVER_URL = import.meta.env.VITE_APP_BASE_URL

const VideoCallModal = () => {

    const {isVideoCallModalOpen, toggleVideoCallModal} = useContext(ChatTabsContext)
  const {receiver, socket} = useContext(ChatContext)
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [peer, setPeer] = useState<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement| null >(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  socket.current = io(SOCKET_SERVER_URL);  // Your server URL

  useEffect(() => {
  
if (socket.current){
  socket.current.on('offer', handleOffer);
  socket.current.on('answer', handleAnswer);
  socket.current.on('ice-candidate', handleIceCandidate);
}


    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const startCall = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
   

    const newPeer = new RTCPeerConnection();
    localStream.getTracks().forEach(track => newPeer.addTrack(track, localStream));

    newPeer.onicecandidate = (event) => {
      if (event.candidate) {
        if (socket.current) {
          socket.current.emit('ice-candidate', event.candidate);
        }
       
      }
    };

    newPeer.ontrack = (event) => {
      if ( remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    
    };

    setPeer(newPeer);

    const offer = await newPeer.createOffer();
    await newPeer.setLocalDescription(offer);
    if (socket.current){
      socket.current.emit('offer', offer);
    }
    
    setIsCallActive(true);
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    const newPeer = new RTCPeerConnection();

    newPeer.onicecandidate = (event) => {
      if (event.candidate) {
        if (socket.current)
        socket.current.emit('ice-candidate', event.candidate);
      }
    };

    newPeer.ontrack = (event) => {
      if (remoteVideoRef.current){
        remoteVideoRef.current.srcObject = event.streams[0];
      }
   
    };

    await newPeer.setRemoteDescription(new RTCSessionDescription(offer));

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStream.getTracks().forEach(track => newPeer.addTrack(track, localStream));
   if (localVideoRef.current){
    localVideoRef.current.srcObject = localStream;

   }
 
    const answer = await newPeer.createAnswer();
    await newPeer.setLocalDescription(answer);
   if (socket.current){
    socket.current.emit('answer', answer);
   }
  
    setPeer(newPeer);
    setIsCallActive(true);
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    peer?.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleIceCandidate = (candidate: RTCIceCandidateInit | undefined) => {
    peer?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  if (!isVideoCallModalOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      onClick={toggleVideoCallModal}
    >
      <div
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="bg-[url('https://img.freepik.com/premium-photo/ai-generated-images-build-user-profile-page_1290175-101.jpg')] bg-cover bg-center  rounded-full  w-32 h-32 bg-slate-400 m-auto">

</div>

<p className='text-lg text-center'> {receiver?.firstname.toUpperCase()} </p>

<p className='text-lg text-center font-semibold'>
Video Call
   </p>
<div className="flex mx-24 mt-8 space-x-4 " >
    <div    onClick={toggleVideoCallModal}  className="bg-red-600 rounded-full p-8 text-white font-bold text-lg  space-x-4 w-20 h-20">X</div>
    <div  className="bg-green-600 rounded-full  w-20 h-20">{!isCallActive &&<i onClick={startCall} className='bx bx-sm p-8 text-white bxs-phone-call'></i>}
       </div>
       
 </div>
      </div>
      <div className='h-screen pb-8'>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
      {!isCallActive && <button onClick={startCall}>Start Video Call</button>}
    </div>
    </div>
  );
};

export default VideoCallModal;