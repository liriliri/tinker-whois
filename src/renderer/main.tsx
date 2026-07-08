import { createRoot } from 'react-dom/client'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import className from 'licia/className'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import WhoisSearchBar from './components/WhoisSearchBar'
import WhoisResultsView from './components/WhoisResultsView'
import WhoisErrorView from './components/WhoisErrorView'
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
  const { result } = store
  const [showRaw, setShowRaw] = useState(false)

  const handleQueryComplete = () => {
    setShowRaw(false)
  }

  return (
    <div className={className('h-screen', tw.background.primary)}>
      <div className="mx-auto max-w-5xl h-full flex flex-col">
        <WhoisSearchBar
          onQueryComplete={handleQueryComplete}
          hideExamples={!!result}
        />

        {result &&
          (result.success ? (
            <WhoisResultsView
              parsed={result.parsed}
              rawData={result.data}
              server={result.server}
              showRaw={showRaw}
              onToggleView={() => setShowRaw(!showRaw)}
            />
          ) : (
            <div className="px-8 pb-8">
              <WhoisErrorView error={result.error || 'unknownError'} />
            </div>
          ))}
      </div>
    </div>
  )
})

;(async function () {
  const language = await tinker.getLanguage()
  i18n.changeLanguage(language)
  const container = document.getElementById('app') as HTMLElement
  createRoot(container).render(<Whois />)
})()
