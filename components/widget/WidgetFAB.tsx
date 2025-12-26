'use client'

import { MessageCircle } from 'lucide-react'
import { useWidget } from '../../contexts/WidgetContext'

export default function WidgetFAB() {
  const { openWidget, isWidgetOpen } = useWidget()

  if (isWidgetOpen) return null

  return (
    <button
      onClick={openWidget}
      className="fixed bottom-[24px] right-[24px] z-[999] w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      aria-label="Открыть виджет поддержки"
    >
      <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
    </button>
  )
}

