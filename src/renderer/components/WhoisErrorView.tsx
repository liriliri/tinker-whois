import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { tw } from '../theme'

interface WhoisErrorViewProps {
  error: string
}

const WhoisErrorView = ({ error }: WhoisErrorViewProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={`flex items-start gap-4 p-6 bg-gradient-to-br ${tw.error.background} border ${tw.error.border} rounded-md`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${tw.error.icon.background} border ${tw.error.icon.border}`}
      >
        <AlertCircle className={`w-5 h-5 ${tw.error.icon.text}`} />
      </div>
      <div className="flex-1">
        <h3 className={`font-bold mb-2 text-base ${tw.error.text.title}`}>
          {t('queryFailed')}
        </h3>
        <p
          className={`text-sm font-mono leading-relaxed ${tw.error.text.content}`}
        >
          {error}
        </p>
      </div>
    </div>
  )
}

export default WhoisErrorView
