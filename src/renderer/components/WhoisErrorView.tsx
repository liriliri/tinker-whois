import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import className from 'licia/className'
import { tw } from '../theme'

interface WhoisErrorViewProps {
  error: string
}

const WhoisErrorView = ({ error }: WhoisErrorViewProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={className(
        'flex items-start gap-3 rounded border p-3',
        tw.error.background,
        tw.error.border,
      )}
    >
      <AlertCircle
        className={className('mt-0.5 h-4 w-4 shrink-0', tw.error.icon.text)}
      />
      <div className="min-w-0 flex-1">
        <p className={className('text-sm font-medium', tw.error.text.title)}>
          {t('queryFailed')}
        </p>
        <p
          className={className(
            'mt-1 font-mono text-sm leading-relaxed',
            tw.error.text.content,
          )}
        >
          {t(error, { defaultValue: error })}
        </p>
      </div>
    </div>
  )
}

export default WhoisErrorView
