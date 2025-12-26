'use client'

import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuToggle: () => void
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#e2e8f0] px-4 py-3 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="text-sm">
            <span className="text-gray-500">Organization:</span>{' '}
            <span className="font-bold text-gray-900">test organization</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-gray-100/50 text-gray-700 text-xs font-semibold rounded-full uppercase border border-gray-200">
            OWNER
          </span>
        </div>
      </div>
    </header>
  )
}

