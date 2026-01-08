'use client'

import { useSuggestions } from '../../contexts/SuggestionsContext'
import { X, ThumbsUp, ThumbsDown } from 'lucide-react'
import { getDiscordStatusColor, formatRelativeTime } from '../../data/suggestions'

interface DiscordPreviewModalProps {
  suggestionId: string
  onClose: () => void
}

export default function DiscordPreviewModal({ suggestionId, onClose }: DiscordPreviewModalProps) {
  const { getSuggestionById } = useSuggestions()
  const suggestion = getSuggestionById(suggestionId)

  if (!suggestion) return null

  const embedColor = getDiscordStatusColor(suggestion.lifecycle.status)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#313338] rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e1f22]">
          <h2 className="text-lg font-semibold text-white">Discord Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2b2d31] rounded-md transition-colors"
          >
            <X className="h-5 w-5 text-[#b9bbbe]" />
          </button>
        </div>

        {/* Body - Discord Message Style */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={suggestion.author.avatar_url}
                alt={suggestion.author.username}
                className="w-10 h-10 rounded-full"
              />
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              {/* Author & Timestamp */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white">
                  {suggestion.author.username}
                </span>
                <span className="text-xs text-[#b9bbbe]">
                  {formatRelativeTime(suggestion.created_at)}
                </span>
              </div>

              {/* Embed */}
              <div className="mt-2 rounded border-l-4" style={{ borderLeftColor: embedColor }}>
                <div className="bg-[#2b2d31] rounded-r p-4">
                  {/* Title */}
                  <div className="mb-2">
                    <h3 className="text-base font-semibold text-white mb-1">
                      {suggestion.content.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <p className="text-sm text-[#dcddde] whitespace-pre-wrap">
                      {suggestion.content.description}
                    </p>
                  </div>

                  {/* Fields */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#b9bbbe] uppercase">
                        Status:
                      </span>
                      <span className="text-xs text-[#dcddde]">
                        {suggestion.lifecycle.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#b9bbbe] uppercase">
                        Category:
                      </span>
                      <span className="text-xs text-[#dcddde]">
                        {suggestion.content.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#b9bbbe] uppercase">
                        Score:
                      </span>
                      <span className="text-xs text-[#dcddde]">
                        {suggestion.metrics.score} ({suggestion.metrics.upvotes} upvotes, {suggestion.metrics.downvotes} downvotes)
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-2 text-xs text-[#b9bbbe]">
                    <span>NinjaBot</span>
                    <span>•</span>
                    <span>{suggestion.id}</span>
                  </div>
                </div>
              </div>

              {/* Buttons (Discord style) */}
              <div className="flex items-center gap-4 mt-3">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2b2d31] hover:bg-[#36393f] rounded transition-colors group">
                  <ThumbsUp className="h-4 w-4 text-[#b9bbbe] group-hover:text-white" />
                  <span className="text-sm text-[#b9bbbe] group-hover:text-white">
                    {suggestion.metrics.upvotes}
                  </span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2b2d31] hover:bg-[#36393f] rounded transition-colors group">
                  <ThumbsDown className="h-4 w-4 text-[#b9bbbe] group-hover:text-white" />
                  <span className="text-sm text-[#b9bbbe] group-hover:text-white">
                    {suggestion.metrics.downvotes}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

