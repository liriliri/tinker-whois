import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import * as Separator from '@radix-ui/react-separator'
import className from 'licia/className'
import { Search, Loader2 } from 'lucide-react'
import store from '../store'

interface WhoisSearchBarProps {
  onQueryComplete?: () => void
  hideExamples?: boolean
}

const WhoisSearchBar = observer(
  ({ onQueryComplete, hideExamples = false }: WhoisSearchBarProps = {}) => {
    const { t } = useTranslation()
    const { query, loading } = store

    const handleQuery = async () => {
      await store.executeQuery()
      onQueryComplete?.()
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !loading && query.trim()) {
        handleQuery()
      }
    }

    const handleQueryChange = (value: string) => {
      store.setQuery(value)
    }

    const handleExampleClick = (example: string) => {
      store.setQuery(example)
    }

    const examples = ['google.com', 'github.com', '8.8.8.8', 'AS15169']

    return (
      <>
        <div className="flex gap-2 mb-4 px-6 pt-6">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('placeholder')}
            className={className(
              'flex-1 px-3 py-2 bg-white dark:bg-slate-900',
              'border border-slate-300 dark:border-slate-700',
              'text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'rounded font-mono text-sm',
              'focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 dark:focus:border-slate-500',
              'transition-colors duration-150',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:border-slate-400 dark:hover:border-slate-600',
            )}
            disabled={loading}
          />
          <button
            onClick={handleQuery}
            disabled={loading || !query.trim()}
            className={className(
              'w-40 px-4 py-2 rounded font-medium text-sm',
              'bg-slate-700 dark:bg-slate-600',
              'text-white',
              'hover:bg-slate-800 dark:hover:bg-slate-700',
              'disabled:bg-slate-300 dark:disabled:bg-slate-700',
              'disabled:cursor-not-allowed',
              'transition-colors duration-150',
              'flex items-center justify-center gap-2',
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('querying')}
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                {t('query')}
              </>
            )}
          </button>
        </div>

        {!hideExamples && (
          <>
            <Separator.Root className="bg-slate-200 dark:bg-slate-800 h-[1px] mb-3 mx-6" />

            <div className="flex items-center gap-2 flex-wrap mb-4 px-6">
              <div className="flex gap-2 flex-wrap">
                {examples.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleClick(example)}
                    className={className(
                      'text-xs px-2.5 py-1 font-mono rounded-sm',
                      'bg-slate-100 dark:bg-slate-800',
                      'text-slate-600 dark:text-slate-400',
                      'border border-slate-200 dark:border-slate-700',
                      'hover:bg-slate-200 dark:hover:bg-slate-700',
                      'hover:border-slate-300 dark:hover:border-slate-600',
                      'transition-colors duration-150',
                    )}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </>
    )
  },
)

export default WhoisSearchBar
