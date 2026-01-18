'use client'

import { Check, AlertCircle } from 'lucide-react'
import { DiscordDMMessage } from '../../../data/discordDmMockFlow'

interface DiscordMessageProps {
  message: DiscordDMMessage
  showAvatar?: boolean
}

export default function DiscordMessage({ message, showAvatar = true }: DiscordMessageProps) {
  const isUser = message.author === 'user'
  const isBot = message.author === 'bot'
  const isSystem = message.type === 'ticket_created' || message.type === 'ticket_closed'
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const getMessageStyle = () => {
    if (isSystem) {
      return 'bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2]'
    }
    if (isUser) {
      return 'bg-[#5865F2] text-white'
    }
    return 'bg-[#2f3136] text-[#dcddde]'
  }

  const getAuthorColor = () => {
    if (isBot) return 'text-[#5865F2]'
    if (isUser) return 'text-[#5865F2]'
    return 'text-[#dcddde]'
  }

  if (isSystem) {
    return (
      <div className="px-4 py-3 flex justify-center">
        <div className={`w-full px-4 py-2.5 rounded ${getMessageStyle()}`}>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#5865F2]"></div>
            <p className="text-sm font-medium text-center">
              {message.content}
            </p>
            <div className="w-1 h-1 rounded-full bg-[#5865F2]"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 px-4 py-1 hover:bg-[#32353b] transition-colors">
      {showAvatar ? (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-semibold text-sm border-2 border-[#36393f]">
          {message.authorName.charAt(0).toUpperCase()}
        </div>
      ) : (
        <div className="flex-shrink-0 w-10 h-10"></div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`font-semibold text-sm ${getAuthorColor()}`}>
            {message.authorName}
          </span>
          <span className="text-xs text-[#72767d]">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className={`inline-block px-3 py-1.5 rounded ${getMessageStyle()}`}>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>
        {message.status && isUser && (
          <div className="flex items-center gap-1 mt-0.5 ml-1">
            {message.status === 'delivered' && (
              <>
                <Check className="w-3 h-3 text-[#72767d]" />
                <span className="text-xs text-[#72767d]">Sent to DM</span>
              </>
            )}
            {message.status === 'failed' && (
              <>
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500">Delivery Failed</span>
                {message.errorCode && (
                  <span className="text-xs text-red-500 ml-1">({message.errorCode})</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
