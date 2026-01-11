'use client'

import { useParams } from 'next/navigation'
import Sidebar from '../../../components/admin/Sidebar'
import TicketView from '../../../components/admin/TicketView'
import { useState, Suspense } from 'react'

export default function TicketPage() {
  const params = useParams()
  const id = params.id as string
  // На desktop sidebar всегда виден через CSS, на мобильных закрыт по умолчанию
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Suspense fallback={<div className="fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#1e293b]" />}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </Suspense>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TicketView ticketId={id} />
      </div>
    </div>
  )
}

