'use client'

import { useEffect, useRef } from 'react'
import { DiscordDMMessage } from '../../../data/discordDmMockFlow'
import DiscordMessage from './DiscordMessage'

interface DiscordChatProps {
  messages: DiscordDMMessage[]
  isTyping?: boolean
  typingAuthor?: string
}

export default function DiscordChat({ messages, isTyping = false, typingAuthor }: DiscordChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto bg-[#36393f]">
      <div className="px-4 py-4">
        {messages.map((message, index) => {
          if (!message) return null
          
          const prevMessage = index > 0 ? messages[index - 1] : null
          const showAvatar = !prevMessage || 
            !prevMessage.author || 
            prevMessage.author !== message.author || 
            (prevMessage.timestamp && message.timestamp && 
              (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) > 300000) // 5 minutes
          
          return (
            <div
              key={message.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DiscordMessage message={message} showAvatar={showAvatar} />
            </div>
          )
        })}
        
        {isTyping && typingAuthor && (
          <div className="flex gap-3 px-4 py-2 animate-fade-in-up">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-semibold text-sm">
              {typingAuthor.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#72767d] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-[#72767d] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[#72767d] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm text-[#72767d]">{typingAuthor} is typing...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
