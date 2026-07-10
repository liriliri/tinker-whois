import { useTranslation } from 'react-i18next'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Separator from '@radix-ui/react-separator'
import className from 'licia/className'
import { Server, FileText, FileCode } from 'lucide-react'
import type { ParsedWhoisData } from '../../common/types'
import { tw } from '../theme'

interface WhoisResultsViewProps {
  parsed?: ParsedWhoisData
  rawData?: string
  server?: string
  showRaw: boolean
  onToggleView: () => void
}

const WhoisResultsView = ({
  parsed,
  rawData,
  server,
  showRaw,
  onToggleView,
}: WhoisResultsViewProps) => {
  const { t } = useTranslation()

  const renderDataField = (label: string, value: string | string[]) => {
    if (!value) return null

    const items = Array.isArray(value) ? value : [value]

    return (
      <div key={label}>
        <dt className={className('mb-1 text-xs', tw.text.quaternary)}>
          {label}
        </dt>
        <dd className="mb-4">
          <div className="flex flex-col gap-1">
            {items.map((item, idx) => (
              <span
                key={idx}
                className={className('font-mono text-sm', tw.text.secondary)}
              >
                {item}
              </span>
            ))}
          </div>
        </dd>
      </div>
    )
  }

  const renderParsedData = (data: ParsedWhoisData) => {
    const fields: Record<string, string | string[]> = {}

    if (data.domainName) fields[t('domainName')] = data.domainName
    if (data.registrar) fields[t('registrar')] = data.registrar
    if (data.registrarUrl) fields[t('registrarUrl')] = data.registrarUrl
    if (data.creationDate) fields[t('creationDate')] = data.creationDate
    if (data.expiryDate) fields[t('expiryDate')] = data.expiryDate
    if (data.updatedDate) fields[t('updatedDate')] = data.updatedDate
    if (data.status && data.status.length > 0) fields[t('status')] = data.status
    if (data.nameServers && data.nameServers.length > 0)
      fields[t('nameServers')] = data.nameServers
    if (data.dnssec) fields[t('dnssec')] = data.dnssec

    return (
      <dl>
        {Object.entries(fields).map(([label, value]) =>
          renderDataField(label, value),
        )}
      </dl>
    )
  }

  const renderRawData = (data?: string) => {
    return (
      <pre
        className={className(
          'font-mono text-sm leading-relaxed whitespace-pre-wrap',
          tw.text.secondary,
        )}
      >
        {data || ''}
      </pre>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
      <Separator.Root className={className(tw.separator, 'mb-3 h-px')} />

      <div className="mb-3 flex shrink-0 items-center justify-between">
        <span className={className('text-sm font-medium', tw.text.tertiary)}>
          {t('queryResults')}
        </span>
        <div className="flex items-center gap-2">
          {parsed && (
            <button
              onClick={onToggleView}
              className={className(
                'flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs',
                showRaw
                  ? [
                      tw.button.active.base,
                      tw.button.active.border,
                      tw.button.active.text,
                    ]
                  : [
                      tw.button.secondary.base,
                      tw.button.secondary.border,
                      tw.text.tertiary,
                      tw.button.secondary.hover,
                    ],
              )}
            >
              {showRaw ? (
                <>
                  <FileText className="h-3.5 w-3.5" />
                  {t('viewParsed')}
                </>
              ) : (
                <>
                  <FileCode className="h-3.5 w-3.5" />
                  {t('viewRaw')}
                </>
              )}
            </button>
          )}
          {server && (
            <div
              className={className(
                'flex items-center gap-1.5 rounded border px-2.5 py-1',
                tw.serverBadge.background,
                tw.serverBadge.border,
              )}
            >
              <Server
                className={className('h-3.5 w-3.5', tw.serverBadge.text)}
              />
              <span
                className={className('font-mono text-xs', tw.serverBadge.text)}
              >
                {t(server, { defaultValue: server })}
              </span>
            </div>
          )}
        </div>
      </div>

      <ScrollArea.Root className="min-h-0 flex-1" type="auto">
        <ScrollArea.Viewport
          className={className(
            'h-full w-full rounded border p-3',
            tw.background.surface,
            tw.border.secondary,
          )}
        >
          {showRaw || !parsed
            ? renderRawData(rawData)
            : renderParsedData(parsed)}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex w-2 touch-none p-0.5 select-none"
          orientation="vertical"
        >
          <ScrollArea.Thumb
            className={className(
              'flex-1 rounded-full',
              tw.scrollbar.thumb,
              tw.scrollbar.thumbHover,
            )}
          />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}

export default WhoisResultsView
