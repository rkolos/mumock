'use client'

import { useState } from 'react'
import Sidebar from '../components/admin/Sidebar'
import Header from '../components/admin/Header'
import TicketsList from '../components/admin/TicketsList'

export default function AdminPage() {
  // На desktop sidebar всегда виден через CSS, на мобильных закрыт по умолчанию
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <TicketsList />
        </main>
      </div>
    </div>
  )
}

