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
          <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            {icon}
            {label}
          </dt>
          <dd className="text-sm mb-4">
            <div className="flex flex-col gap-1">
              {value.map((item, idx) => (
                <span
                  key={idx}
                  className="text-slate-700 dark:text-slate-300 font-mono text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700"
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
        <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
          {icon}
          {label}
        </dt>
        <dd className="text-sm text-slate-700 dark:text-slate-300 font-mono mb-4">
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
      <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
        {data || ''}
      </pre>
    )
  }

  return (
    <div className="flex-1 min-h-0 px-6 pb-6 flex flex-col">
      <Separator.Root className="bg-slate-200 dark:bg-slate-800 h-[1px] mb-4" />

      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
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
                  ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
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
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700">
              <Server className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
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
          <ScrollArea.Thumb className="flex-1 bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}

export default WhoisResultsView
