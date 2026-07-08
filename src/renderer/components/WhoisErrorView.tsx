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
        'flex items-start gap-4 p-6 bg-gradient-to-br border rounded-md',
        tw.error.background,
        tw.error.border,
      )}
    >
      <div
        className={className(
          'flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border',
          tw.error.icon.background,
          tw.error.icon.border,
        )}
      >
        <AlertCircle className={className('w-5 h-5', tw.error.icon.text)} />
      </div>
      <div className="flex-1">
        <h3
          className={className('font-bold mb-2 text-base', tw.error.text.title)}
        >
          {t('queryFailed')}
        </h3>
        <p
          className={className(
            'text-sm font-mono leading-relaxed',
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
