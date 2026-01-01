'use client'

import { FolderOpen, FileText, Ticket, Bot, Globe, Sparkles } from 'lucide-react'

export type SourceType = 'all' | 'files' | 'articles' | 'tickets' | 'notion' | 'crawler'

interface SourceSidebarProps {
  activeSource: SourceType
  onSourceChange: (source: SourceType) => void
  allContentCount: number
  filesCount: number
  articlesCount: number
  ticketsCount: number
  onSimulatorClick: () => void
  isSimulatorActive: boolean
}

export default function SourceSidebar({
  activeSource,
  onSourceChange,
  allContentCount,
  filesCount,
  articlesCount,
  ticketsCount,
  onSimulatorClick,
  isSimulatorActive,
}: SourceSidebarProps) {
  const sources = [
    {
      id: 'all' as SourceType,
      label: 'All Content',
      icon: <FileText className="h-4 w-4" />,
      count: allContentCount,
      enabled: true,
    },
    {
      id: 'files' as SourceType,
      label: 'Files Library',
      icon: <FolderOpen className="h-4 w-4" />,
      count: filesCount,
      enabled: true,
    },
    {
      id: 'articles' as SourceType,
      label: 'Internal Articles',
      icon: <FileText className="h-4 w-4" />,
      count: articlesCount,
      enabled: true,
    },
    {
      id: 'tickets' as SourceType,
      label: 'Learned Tickets',
      icon: <Ticket className="h-4 w-4" />,
      count: ticketsCount,
      enabled: true,
    },
    {
      id: 'notion' as SourceType,
      label: 'Notion',
      icon: <Bot className="h-4 w-4" />,
      count: null,
      enabled: false,
      comingSoon: true,
    },
    {
      id: 'crawler' as SourceType,
      label: 'Website Crawler',
      icon: <Globe className="h-4 w-4" />,
      count: null,
      enabled: false,
      comingSoon: true,
    },
  ]

  return (
    <div className="w-[260px] bg-[#f5f7fb] border-r border-[#e2e8f0] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#e2e8f0]">
        <h2 className="text-base font-bold text-gray-900">Knowledge Hub</h2>
      </div>

      {/* Sources List */}
      <nav className="flex-1 overflow-y-auto p-2">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => source.enabled && onSourceChange(source.id)}
            disabled={!source.enabled}
            className={`
              w-full flex items-center justify-between px-3 py-2.5 rounded-md mb-1
              transition-colors text-left
              ${
                activeSource === source.id && source.enabled && !isSimulatorActive
                  ? 'bg-blue-100 text-blue-900'
                  : source.enabled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">{source.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{source.label}</div>
                {source.comingSoon && (
                  <div className="text-xs text-gray-400 mt-0.5">Coming soon</div>
                )}
              </div>
            </div>
            {source.count !== null && (
              <span
                className={`text-xs font-medium flex-shrink-0 ml-2 ${
                  activeSource === source.id && source.enabled
                    ? 'text-blue-700'
                    : 'text-gray-500'
                }`}
              >
                {source.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer - AI Simulator Button */}
      <div className="p-4 border-t border-[#e2e8f0]">
        <button
          onClick={onSimulatorClick}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isSimulatorActive
              ? 'bg-blue-100 text-blue-900'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Simulator</span>
        </button>
      </div>
    </div>
  )
}

