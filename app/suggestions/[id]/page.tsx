'use client'

import { useParams, useRouter } from 'next/navigation'
import Sidebar from '../../../components/admin/Sidebar'
import Header from '../../../components/admin/Header'
import { SuggestionsProvider } from '../../../contexts/SuggestionsContext'
import SuggestionDetail from '../../../components/admin/SuggestionDetail'
import SuggestionsCardList from '../../../components/admin/SuggestionsCardList'
import { useState } from 'react'
import { GripVertical } from 'lucide-react'

export default function SuggestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSuggestionSelect = (suggestionId: string) => {
    router.push(`/suggestions/${suggestionId}`)
  }

  return (
    <SuggestionsProvider>
      <div className="flex h-screen bg-[#f8fafc]">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
            {/* Левая панель - Список */}
            <div
              className="bg-white border-r border-gray-200 flex flex-col overflow-hidden"
              style={{ width: '275px', minWidth: '250px', maxWidth: '300px' }}
            >
              <SuggestionsCardList 
                onSuggestionSelect={handleSuggestionSelect}
                selectedSuggestionId={id}
              />
            </div>
            
            {/* Разделитель */}
            <div className="w-1 bg-gray-200 flex items-center justify-center transition-colors relative">
              <GripVertical className="h-5 w-5 absolute transition-colors text-gray-400" />
            </div>
            
            {/* Правая панель - Детали */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden">
              <SuggestionDetail suggestionId={id} />
            </div>
          </main>
        </div>
      </div>
    </SuggestionsProvider>
  )
}

