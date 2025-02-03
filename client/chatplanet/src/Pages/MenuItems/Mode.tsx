import { ChatTabsContext } from "../../Context/chatTabs"
import { useContext } from "react"
const Mode = () => {
  const {isDarkMode, setIsDarkMode} = useContext(ChatTabsContext)
  return (
    <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="px-4 py-2 text-white bg-blue-500 rounded-full"
      >
         {isDarkMode ? <i className='bx bx-sun'></i> : <i className='bx bx-moon' ></i>} Mode
      </button>
  )
}

export default Mode