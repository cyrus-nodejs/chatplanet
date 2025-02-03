
import ChatBox from './ChatBox'
import { useEffect} from 'react'
import { fetchAsyncUser, getIsAuthenticated, getAuthUser } from '../../Redux/features/auth/authSlice'
import ContactModal from '../../components/modal/contactModal'
import GroupModal from '../../components/modal/groupModal'
import PhoneCallModal from '../../components/modal/phoneCallModal'
import VideoCallModal from '../../components/modal/videoCallModal'
import MenuIndex from './MenuIndex'
import Login from '../Auth/Login'
import Appbar from './Appbar'
import AddGroupContactModal from '../../components/modal/AddGroupContactModal'
import { useAppDispatch, useAppSelector } from '../../Redux/app/hook'

const Index = ({isDarkMode, setIsDarkMode}) => {
 
  const dispatch = useAppDispatch()
  const authUser = useAppSelector(getAuthUser)
 const isAuthenticated = useAppSelector(getIsAuthenticated)

  useEffect(() => {
    
    dispatch(fetchAsyncUser());
  
  }, [dispatch])
  
  
    

  




  return (
    <section>
  {authUser && isAuthenticated ? (
    <div className=" flex h-screen   overflow-hidden   bg-stone-200   ">
        <Appbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
  <MenuIndex  />
<ChatBox  />

<ContactModal />
<GroupModal />
<PhoneCallModal />
<VideoCallModal />
<AddGroupContactModal />
      </div>) : (
        <Login />
      )}
    
    
    </section>
    
    
  )
}

export default Index