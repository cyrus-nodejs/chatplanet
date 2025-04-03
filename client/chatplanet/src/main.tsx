import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import {store} from "./Redux/app/store.tsx"
import './index.css'
import {ChatProvider} from './Context/chatContext.tsx'
import { ChatTabsProvider } from './Context/chatTabs.tsx';
import App from './App.tsx'
import { IStaticMethods } from 'flyonui/flyonui';
import './i18n'; // Import the i18n configuration
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

window.HSStaticMethods?.autoInit();
createRoot(document.getElementById('root')!).render(
  <StrictMode>

<Provider store={store}>
  <ChatTabsProvider>
  <ChatProvider>

    <App />
  
    </ChatProvider>
    </ChatTabsProvider>
   </Provider>
  </StrictMode>,
)
