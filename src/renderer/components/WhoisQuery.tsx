import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import store from '../store'
import { tw } from '../theme'
import WhoisSearchBar from './WhoisSearchBar'
import WhoisResultsView from './WhoisResultsView'
import WhoisErrorView from './WhoisErrorView'

const WhoisQuery = observer(() => {
  const { result } = store
  const [showRaw, setShowRaw] = useState(false)

  const handleQueryComplete = () => {
    setShowRaw(false) // Reset to parsed view when making a new query
  }

  return (
    <div className={`h-screen ${tw.background.primary}`}>
      <div className="mx-auto max-w-5xl h-full flex flex-col">
        {!result && <WhoisSearchBar onQueryComplete={handleQueryComplete} />}

        {result && (
          <>
            <WhoisSearchBar
              onQueryComplete={handleQueryComplete}
              hideExamples
            />

            {result.success ? (
              <WhoisResultsView
                parsed={result.parsed}
                rawData={result.data}
                server={result.server}
                showRaw={showRaw}
                onToggleView={() => setShowRaw(!showRaw)}
              />
            ) : (
              <div className="px-8 pb-8">
                <WhoisErrorView error={result.error || 'Unknown error'} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
})

export default WhoisQuery
