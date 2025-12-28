import type { Metadata } from 'next'
import '../globals.css'
import { WidgetProvider } from '../contexts/WidgetContext'
import WidgetIntegration from '../components/widget/WidgetIntegration'

export const metadata: Metadata = {
  title: 'NinjaTickets Admin',
  description: 'Admin panel for NinjaTickets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning className="light" style={{ colorScheme: 'light' }}>
      <body className="antialiased" suppressHydrationWarning style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
        <WidgetProvider>
          {children}
          <WidgetIntegration />
        </WidgetProvider>
      </body>
    </html>
  )
}

