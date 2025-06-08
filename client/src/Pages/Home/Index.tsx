
import ChatBox from './ChatBox'

import ContactModal from '../../components/modal/contactModal'
import GroupModal from '../../components/modal/groupModal'
import PhoneCallModal from '../../components/modal/phoneCallModal'
import VideoCallModal from '../../components/modal/videoCallModal'
import ProfileImageModal from '../../components/updateModal/profileImage'
import AboutModal from '../../components/updateModal/about'
import MobileModal from '../../components/updateModal/phoneNo'
import LocationModal from '../../components/updateModal/location'
import MenuIndex from './MenuIndex'

import Appbar from './Appbar'
import AddGroupContactModal from '../../components/modal/AddGroupContactModal'

import MessageImageModal from '../../components/updateModal/ImageModal'
import FilesModal from '../../components/updateModal/fileModal'
const Index = () => {
 




  return (
    <section>
 
    <div className=" flex h-screen   overflow-hidden   bg-stone-200   dark:bg-gray-800 text-black dark:text-white ">
        <Appbar />
  <MenuIndex  />
<ChatBox  />

<ContactModal />
<GroupModal />
<PhoneCallModal />
<VideoCallModal />
<AddGroupContactModal />
<ProfileImageModal />
<MobileModal />
<LocationModal />
<AboutModal />
<MessageImageModal />
<FilesModal />
      </div>
    
    
    </section>
    
    
  )
}

export default Index