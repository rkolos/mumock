'use client'

import { useWidget } from '../../contexts/WidgetContext'
import WidgetRoot from './WidgetRoot'
import WidgetFAB from './WidgetFAB'
import Toast from './Toast'

export default function WidgetIntegration() {
  const { isWidgetOpen, closeWidget } = useWidget()
  
  return (
    <>
      <WidgetFAB />
      <WidgetRoot isOpen={isWidgetOpen} onClose={closeWidget} />
      <Toast />
    </>
  )
}

