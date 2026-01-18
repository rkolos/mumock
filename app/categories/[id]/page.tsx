'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Sidebar from '../../../components/admin/Sidebar'
import Header from '../../../components/admin/Header'
import CategoryDetail from '../../../components/admin/CategoryDetail'
import { SourceType } from '../../../data/categories'
import { useState, Suspense } from 'react'

function CategoryPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const integrationParam = searchParams.get('integration')
  
  // Проверяем, что integrationParam является валидным SourceType
  const validSourceTypes: SourceType[] = ['discord', 'discord_private_bot', 'web_widget', 'telegram']
  const integrationSourceType: SourceType | undefined = integrationParam && validSourceTypes.includes(integrationParam as SourceType)
    ? (integrationParam as SourceType)
    : undefined
  
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
          <CategoryDetail categoryId={id} integrationSourceType={integrationSourceType} />
        </main>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-[#f8fafc] items-center justify-center">Loading...</div>}>
      <CategoryPageContent />
    </Suspense>
  )
}
