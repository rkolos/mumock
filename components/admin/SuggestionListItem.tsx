'use client'

import { MessageSquare, Globe, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Suggestion, getStatusColor, formatRelativeTime } from '../../data/suggestions'

interface SuggestionListItemProps {
  suggestion: Suggestion
  isSelected: boolean
  onClick: () => void
  getCategories: () => Array<{ id: string; label: string; color: string }>
}

export default function SuggestionListItem({
  suggestion,
  isSelected,
  onClick,
  getCategories,
}: SuggestionListItemProps) {
  const statusColor = getStatusColor(suggestion.lifecycle.status)
  const SourceIcon = getSourceIcon(suggestion.source)
  const sourceIconColor = getSourceIconColor(suggestion.source)
  const categories = getCategories()
  const categoryConfig = categories.find(cat => cat.label === suggestion.content.category)
  const categoryLabel = suggestion.content.category === 'Financial' ? 'BILLING' : suggestion.content.category.toUpperCase()

  return (
    <div
      onClick={onClick}
      className={`
        flex items-start gap-3 py-3 px-4 border-b border-[#F0F0F0] cursor-pointer
        hover:bg-[#F5F7FB] transition-colors relative
        ${isSelected ? 'bg-[#F0F4FF] border-l-[3px] border-l-[#1976D2]' : ''}
      `}
    >
      {/* Аватар с badge источника */}
      <div className="relative flex-shrink-0">
        {suggestion.author.avatar_url ? (
          <img
            src={suggestion.author.avatar_url}
            alt={suggestion.author.username}
            className="h-9 w-9 rounded-full"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {suggestion.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Badge источника с белой обводкой */}
        {suggestion.source && (
          <div 
            className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-white flex items-center justify-center" 
            style={{ border: '2px solid white' }}
          >
            <SourceIcon className={`h-2.5 w-2.5 ${sourceIconColor}`} />
          </div>
        )}
      </div>
      
      {/* Контентная часть */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Ряд 1: Title (с переносом) + Votes Counter (правый верхний угол) */}
        <div className="flex items-start gap-1 mb-1" style={{ lineHeight: '1.3' }}>
          <div className="text-[13px] font-semibold text-[#212121] flex-1 min-w-0 line-clamp-2">
            {suggestion.content.title}
          </div>
          {/* Votes Counter - в правом верхнем углу, где у тикета Priority/SLA */}
          {suggestion.lifecycle.status !== 'New' && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded flex-shrink-0">
              <div className="flex items-center gap-1 text-[11px] text-[#757575]">
                <ThumbsUp className="h-3 w-3" />
                <span>{suggestion.metrics.upvotes}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#757575]">
                <ThumbsDown className="h-3 w-3" />
                <span>{suggestion.metrics.downvotes}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Ряд 2: Author + CreatedAt */}
        <div className="flex items-center gap-1 text-[12px] font-normal text-[#757575] mb-1.5">
          <span className="font-medium">
            {suggestion.author.isSystem ? 'Ninja Product Team' : `@${suggestion.author.username}`}
          </span>
          <span>•</span>
          <span>{formatRelativeTime(suggestion.created_at)}</span>
        </div>
        
        {/* Ряд 3: Footer - Category (слева) + Status (справа) */}
        <div className="flex items-center justify-between mt-1.5">
          {/* Категория */}
          <span className="text-[11px] font-bold text-[#9E9E9E] uppercase" style={{ letterSpacing: '0.5px' }}>
            {categoryLabel}
          </span>
          
          {/* Статус */}
          <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${statusColor}`}></div>
            <span className="text-[12px] font-medium text-[#424242]">{suggestion.lifecycle.status}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Получение иконки источника для Suggestions
function getSourceIcon(source: 'discord' | 'web') {
  switch (source) {
    case 'discord':
      return MessageSquare
    case 'web':
      return Globe
    default:
      return MessageSquare
  }
}

// Получение цвета иконки источника для Suggestions
function getSourceIconColor(source: 'discord' | 'web') {
  switch (source) {
    case 'discord':
      return 'text-[#5865F2]'
    case 'web':
      return 'text-gray-600'
    default:
      return 'text-gray-400'
  }
}

