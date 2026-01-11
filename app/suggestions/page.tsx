'use client'

import { useState, Suspense } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import Header from '../../components/admin/Header'
import { SuggestionsProvider } from '../../contexts/SuggestionsContext'
import SuggestionsListTable from '../../components/admin/SuggestionsListTable'

export default function SuggestionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SuggestionsProvider>
      <div className="flex h-screen bg-[#f8fafc]">
        <Suspense fallback={<div className="fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#1e293b]" />}>
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        </Suspense>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto">
            <Suspense fallback={<div className="p-4">Loading...</div>}>
              <SuggestionsListTable />
            </Suspense>
          </main>
        </div>
      </div>
    </SuggestionsProvider>
  )
}

