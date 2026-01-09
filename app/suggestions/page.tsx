'use client'

import { useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import Header from '../../components/admin/Header'
import { SuggestionsProvider } from '../../contexts/SuggestionsContext'
import SuggestionsListTable from '../../components/admin/SuggestionsListTable'

export default function SuggestionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SuggestionsProvider>
      <div className="flex h-screen bg-[#f8fafc]">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto">
            <SuggestionsListTable />
          </main>
        </div>
      </div>
    </SuggestionsProvider>
  )
}

