import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import className from 'licia/className'
import isStrBlank from 'licia/isStrBlank'
import { Search, Loader2 } from 'lucide-react'
import store from '../store'
import { tw } from '../theme'

interface WhoisSearchBarProps {
  onQueryComplete?: () => void
}

const WhoisSearchBar = observer(
  ({ onQueryComplete }: WhoisSearchBarProps = {}) => {
    const { t } = useTranslation()
    const { query, loading } = store

    const handleQuery = async () => {
      await store.executeQuery()
      onQueryComplete?.()
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !loading && !isStrBlank(query)) {
        handleQuery()
      }
    }

    return (
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <div className="flex gap-2.5">
          <input
            type="text"
            value={query}
            onChange={(e) => store.setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('placeholder')}
            className={className(
              'min-w-0 flex-1 px-3 py-2 font-mono text-sm',
              tw.input.base,
              tw.input.border,
              tw.input.text,
              tw.text.placeholder,
              'rounded border',
              'focus:outline-none',
              tw.input.focusRing,
              tw.border.focus,
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            disabled={loading}
            autoFocus
          />
          <button
            onClick={handleQuery}
            disabled={loading || isStrBlank(query)}
            className={className(
              'flex shrink-0 items-center gap-2 rounded px-4 py-2 text-sm',
              tw.button.primary.base,
              tw.text.white,
              tw.button.primary.hover,
              tw.button.primary.disabled,
              'disabled:cursor-not-allowed',
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('querying')}
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                {t('query')}
              </>
            )}
          </button>
        </div>
      </div>
    )
  },
)

export default WhoisSearchBar
