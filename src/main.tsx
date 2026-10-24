import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider'
import { AppStoreProvider } from './store/AppStore'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <I18nProvider>
        <AppStoreProvider>
          <App />
        </AppStoreProvider>
      </I18nProvider>
    </HashRouter>
  </StrictMode>,
)
