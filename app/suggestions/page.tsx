'use client'

import { useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import Header from '../../components/admin/Header'
import { SuggestionsProvider } from '../../contexts/SuggestionsContext'
import SuggestionsList from '../../components/admin/SuggestionsList'
import SuggestionDetail from '../../components/admin/SuggestionDetail'

export default function SuggestionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SuggestionsProvider>
      <div className="flex h-screen bg-[#f8fafc]">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
            {/* Левая панель - Список */}
            <div className="w-[400px] border-r border-[#e2e8f0] bg-white flex flex-col overflow-hidden">
              <SuggestionsList />
            </div>
            
            {/* Правая панель - Детали */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden">
              <SuggestionDetail />
            </div>
          </main>
        </div>
      </div>
    </SuggestionsProvider>
  )
}

