'use client'

import { useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import Header from '../../components/admin/Header'
import { Wrench } from 'lucide-react'

export default function BugsPage() {
  // На desktop sidebar всегда виден через CSS, на мобильных закрыт по умолчанию
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Wrench className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-slate-700 mb-2">Under Construction</h1>
              <p className="text-slate-500">This page is currently being developed.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

