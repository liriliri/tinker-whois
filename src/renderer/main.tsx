import { createRoot } from 'react-dom/client'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import className from 'licia/className'
import waitUntil from 'licia/waitUntil'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import WhoisSearchBar from './components/WhoisSearchBar'
import WhoisResultsView from './components/WhoisResultsView'
import WhoisErrorView from './components/WhoisErrorView'
import WhoisEmptyView from './components/WhoisEmptyView'
import store from './store'
import { tw } from './theme'
import enUS from './i18n/en-US.json'
import zhCN from './i18n/zh-CN.json'
import './index.scss'

i18n.use(initReactI18next).init({
  resources: {
    'en-US': { translation: enUS },
    'zh-CN': { translation: zhCN },
  },
  lng: 'en-US',
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
})

const Whois = observer(() => {
  const { result, loading } = store
  const [showRaw, setShowRaw] = useState(false)

  const handleQueryComplete = () => {
    setShowRaw(false)
  }

  return (
    <div className={className('flex h-screen flex-col', tw.background.primary)}>
      <WhoisSearchBar onQueryComplete={handleQueryComplete} />

      {result ? (
        result.success ? (
          <WhoisResultsView
            parsed={result.parsed}
            rawData={result.data}
            server={result.server}
            showRaw={showRaw}
            onToggleView={() => setShowRaw(!showRaw)}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
            <WhoisErrorView error={result.error || 'unknownError'} />
          </div>
        )
      ) : (
        <WhoisEmptyView
          loading={loading}
          onQueryComplete={handleQueryComplete}
        />
      )}
    </div>
  )
})

;(async function () {
  const applyTheme = (theme: string) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }

  const [language, theme] = await Promise.all([
    tinker.getLanguage(),
    tinker.getTheme(),
  ])

  i18n.changeLanguage(language)
  applyTheme(theme)
  tinker.on('changeTheme', applyTheme)

  // ESM preload is async — wait before rendering.
  await waitUntil(() => typeof whois !== 'undefined')

  const container = document.getElementById('app') as HTMLElement
  createRoot(container).render(<Whois />)
})()
