import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import * as Separator from '@radix-ui/react-separator'
import className from 'licia/className'
import { Search, Loader2 } from 'lucide-react'
import store from '../store'
import { tw } from '../theme'

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
              'flex-1 px-3 py-2',
              tw.input.base,
              tw.input.border,
              tw.input.text,
              tw.text.placeholder,
              'border rounded font-mono text-sm',
              'focus:outline-none',
              tw.input.focusRing,
              tw.border.focus,
              'transition-colors duration-150',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              tw.input.borderHover,
            )}
            disabled={loading}
          />
          <button
            onClick={handleQuery}
            disabled={loading || !query.trim()}
            className={className(
              'w-40 px-4 py-2 rounded font-medium text-sm',
              tw.button.primary.base,
              tw.text.white,
              tw.button.primary.hover,
              tw.button.primary.disabled,
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
            <Separator.Root className={`${tw.separator} h-[1px] mb-3 mx-6`} />

            <div className="flex items-center gap-2 flex-wrap mb-4 px-6">
              <div className="flex gap-2 flex-wrap">
                {examples.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleClick(example)}
                    className={className(
                      'text-xs px-2.5 py-1 font-mono rounded-sm',
                      tw.button.secondary.base,
                      tw.text.tertiary,
                      'border',
                      tw.button.secondary.border,
                      tw.button.secondary.hover,
                      tw.button.secondary.borderHover,
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
