import { useTranslation } from 'react-i18next'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Separator from '@radix-ui/react-separator'
import className from 'licia/className'
import {
  Server,
  FileText,
  FileCode,
  Globe,
  Calendar,
  Mail,
  Building2,
  Shield,
} from 'lucide-react'
import type { ParsedWhoisData } from '../../preload/whoisParser'
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

  const getFieldIcon = (label: string) => {
    const iconClass = 'w-3.5 h-3.5 flex-shrink-0'
    const lowerLabel = label.toLowerCase()

    if (lowerLabel.includes('domain') || lowerLabel.includes('url')) {
      return <Globe className={iconClass} />
    }
    if (
      lowerLabel.includes('date') ||
      lowerLabel.includes('expir') ||
      lowerLabel.includes('creat') ||
      lowerLabel.includes('updat')
    ) {
      return <Calendar className={iconClass} />
    }
    if (lowerLabel.includes('mail')) {
      return <Mail className={iconClass} />
    }
    if (
      lowerLabel.includes('registrar') ||
      lowerLabel.includes('organization')
    ) {
      return <Building2 className={iconClass} />
    }
    if (
      lowerLabel.includes('status') ||
      lowerLabel.includes('dnssec') ||
      lowerLabel.includes('server')
    ) {
      return <Shield className={iconClass} />
    }
    return null
  }

  const renderDataField = (label: string, value: any) => {
    if (!value) return null

    const icon = getFieldIcon(label)

    if (Array.isArray(value)) {
      return (
        <div className="group" key={label}>
          <dt
            className={`text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2 ${tw.text.quaternary}`}
          >
            {icon}
            {label}
          </dt>
          <dd className="text-sm mb-4">
            <div className="flex flex-col gap-1">
              {value.map((item, idx) => (
                <span
                  key={idx}
                  className={className(
                    'font-mono text-xs px-2 py-1 rounded border',
                    tw.text.secondary,
                    tw.background.code,
                    tw.border.secondary,
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          </dd>
        </div>
      )
    }

    return (
      <div className="group" key={label}>
        <dt
          className={`text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-2 ${tw.text.quaternary}`}
        >
          {icon}
          {label}
        </dt>
        <dd className={`text-sm font-mono mb-4 ${tw.text.secondary}`}>
          {String(value)}
        </dd>
      </div>
    )
  }

  const renderParsedData = (data: ParsedWhoisData) => {
    const fields: Record<string, any> = {}

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
      <dl className="space-y-1">
        {Object.entries(fields).map(([label, value]) =>
          renderDataField(label, value),
        )}
      </dl>
    )
  }

  const renderRawData = (data?: string) => {
    return (
      <pre
        className={`text-xs font-mono leading-relaxed whitespace-pre-wrap ${tw.text.secondary}`}
      >
        {data || ''}
      </pre>
    )
  }

  return (
    <div className="flex-1 min-h-0 px-6 pb-6 flex flex-col">
      <Separator.Root className={`${tw.separator} h-[1px] mb-4`} />

      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h2 className={`text-base font-semibold ${tw.text.primary}`}>
          {t('queryResults')}
        </h2>
        <div className="flex items-center gap-2">
          {parsed && (
            <button
              onClick={onToggleView}
              className={className(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-sm border transition-colors duration-150',
                'text-xs font-medium',
                showRaw
                  ? `${tw.button.active.base} ${tw.button.active.border} ${tw.button.active.text}`
                  : `${tw.button.secondary.base} ${tw.button.secondary.border} ${tw.text.tertiary} ${tw.button.secondary.hover}`,
              )}
            >
              {showRaw ? (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('viewParsed')}</span>
                </>
              ) : (
                <>
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{t('viewRaw')}</span>
                </>
              )}
            </button>
          )}
          {server && (
            <div
              className={className(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-sm border',
                tw.serverBadge.background,
                tw.serverBadge.border,
              )}
            >
              <Server className={`w-3.5 h-3.5 ${tw.serverBadge.text}`} />
              <span className={`text-xs font-mono ${tw.serverBadge.text}`}>
                {server}
              </span>
            </div>
          )}
        </div>
      </div>

      <ScrollArea.Root className="flex-1 min-h-0" type="auto">
        <ScrollArea.Viewport className="h-full w-full">
          {showRaw || !parsed
            ? renderRawData(rawData)
            : renderParsedData(parsed)}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 transition-colors duration-150 ease-out data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
          orientation="vertical"
        >
          <ScrollArea.Thumb
            className={`flex-1 rounded-full transition-colors ${tw.scrollbar.thumb} ${tw.scrollbar.thumbHover}`}
          />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}

export default WhoisResultsView
