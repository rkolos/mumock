'use client'

import { useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import Header from '../../components/admin/Header'
import KnowledgeBaseV2 from '../../components/admin/KnowledgeBaseV2'

export default function KnowledgeBasePage() {
  // На desktop sidebar всегда виден через CSS, на мобильных закрыт по умолчанию
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-hidden">
          <KnowledgeBaseV2 />
        </main>
      </div>
    </div>
  )
}

