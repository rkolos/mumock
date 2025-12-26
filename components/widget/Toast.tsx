'use client'

import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useWidget } from '../../contexts/WidgetContext'

export default function Toast() {
  const { toasts, removeToast } = useWidget()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[1001] flex flex-col gap-2">
      {toasts.map((toast) => {
        const icons = {
          success: CheckCircle2,
          error: XCircle,
          info: Info
        }
        const colors = {
          success: 'bg-green-50 border-green-200 text-green-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800'
        }
        const Icon = icons[toast.type]

        return (
          <div
            key={toast.id}
            className={`
              ${colors[toast.type]}
              border rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[320px] max-w-md
              animate-in slide-in-from-top-2 fade-in duration-300
            `}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

