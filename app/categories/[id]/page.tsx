'use client'

import { useParams } from 'next/navigation'
import Sidebar from '../../../components/admin/Sidebar'
import Header from '../../../components/admin/Header'
import CategoryDetail from '../../../components/admin/CategoryDetail'
import { useState } from 'react'

export default function CategoryPage() {
  const params = useParams()
  const id = params.id as string
  // На desktop sidebar всегда виден через CSS, на мобильных закрыт по умолчанию
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <CategoryDetail categoryId={id} />
        </main>
      </div>
    </div>
  )
}

