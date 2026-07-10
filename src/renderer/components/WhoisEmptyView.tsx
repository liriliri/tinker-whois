import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import className from 'licia/className'
import { Globe, Loader2, Network, Server } from 'lucide-react'
import store from '../store'
import { tw } from '../theme'

interface WhoisEmptyViewProps {
  loading?: boolean
  onQueryComplete?: () => void
}

const QUERY_TYPES = [
  { key: 'queryTypeDomain', example: 'google.com', icon: Globe },
  { key: 'queryTypeIp', example: '8.8.8.8', icon: Server },
  { key: 'queryTypeAsn', example: 'AS15169', icon: Network },
] as const

const WhoisEmptyView = observer(
  ({ loading = false, onQueryComplete }: WhoisEmptyViewProps) => {
    const { t } = useTranslation()

    const handleExampleClick = async (example: string) => {
      if (store.loading) return
      await store.queryWith(example)
      onQueryComplete?.()
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        <div
          className={className(
            'flex min-h-0 flex-1 flex-col items-center justify-center rounded border p-6',
            tw.background.surface,
            tw.border.secondary,
          )}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2
                className={className('h-8 w-8 animate-spin', tw.text.tertiary)}
              />
              <p className={className('text-sm', tw.text.tertiary)}>
                {t('querying')}
              </p>
            </div>
          ) : (
            <div className="flex w-full max-w-sm flex-col items-center text-center">
              <Globe
                className={className('mb-3 h-9 w-9', tw.text.quaternary)}
              />
              <p
                className={className('text-sm font-medium', tw.text.secondary)}
              >
                {t('emptyTitle')}
              </p>
              <p className={className('mt-1.5 text-sm', tw.text.tertiary)}>
                {t('emptyHint')}
              </p>

              <ul
                className={className(
                  'mt-6 w-full rounded border p-2 text-left',
                  tw.background.code,
                  tw.border.secondary,
                )}
              >
                {QUERY_TYPES.map(({ key, example, icon: Icon }) => (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className={className(
                        'flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left transition-colors',
                        tw.button.secondary.hover,
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon
                          className={className('h-3.5 w-3.5', tw.text.tertiary)}
                        />
                        <span
                          className={className('text-sm', tw.text.secondary)}
                        >
                          {t(key)}
                        </span>
                      </span>
                      <span
                        className={className(
                          'font-mono text-xs',
                          tw.text.tertiary,
                        )}
                      >
                        {example}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  },
)

export default WhoisEmptyView
