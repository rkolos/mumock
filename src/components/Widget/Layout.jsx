import { X, ChevronLeft } from 'lucide-react'
import config from '../../widget-config.json'

function Layout({ title, showBackButton, onClose, onBack, children }) {
  const primaryColor = config.branding.primaryColor

  return (
    <div className="flex flex-col h-full bg-white md:rounded-t-lg shadow-2xl overflow-hidden">
      <div
        className="px-3 md:px-4 py-2 md:py-3 flex items-center justify-between text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              aria-label="Назад"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-base md:text-lg font-semibold">{title}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

export default Layout

