'use client'

import { useState, Suspense } from 'react'
import Sidebar from '../components/admin/Sidebar'
import Header from '../components/admin/Header'
import TicketsList from '../components/admin/TicketsList'

function TicketsListWrapper() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <TicketsList />
    </Suspense>
  )
}

export default function AdminPage() {
  // На desktop sidebar всегда виден через CSS, на мобильных закрыт по умолчанию
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Suspense fallback={<div className="fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#1e293b]" />}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </Suspense>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <TicketsListWrapper />
        </main>
      </div>
    </div>
  )
}

