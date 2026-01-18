'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'
import { discordDMFlow, DiscordDMMessage } from '../../data/discordDmMockFlow'
import DiscordChat from '../../components/admin/discord-dm-demo/DiscordChat'

type FlowStep = 'ticket_creation' | 'conversation' | 'closing' | 'next_ticket'

export default function DiscordDMDemoPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FlowStep>('ticket_creation')
  const [currentMessages, setCurrentMessages] = useState<DiscordDMMessage[]>([])
  const [displayedMessages, setDisplayedMessages] = useState<DiscordDMMessage[]>([])
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [typingAuthor, setTypingAuthor] = useState<string>('')

  // Инициализация сообщений для текущего этапа
  useEffect(() => {
    let messages: DiscordDMMessage[] = []
    
    switch (currentStep) {
      case 'ticket_creation':
        messages = discordDMFlow.ticket1.creation
        break
      case 'conversation':
        messages = discordDMFlow.ticket1.conversation
        break
      case 'closing':
        messages = discordDMFlow.ticket1.closing
        break
      case 'next_ticket':
        messages = discordDMFlow.ticket2.creation
        break
    }
    
    setCurrentMessages(messages)
    setDisplayedMessages([])
  }, [currentStep])

  // Постепенное отображение сообщений
  useEffect(() => {
    if (currentMessages.length === 0) return
    
    let messageIndex = 0
    const messageTimers: NodeJS.Timeout[] = []
    
    const showNextMessage = () => {
      if (messageIndex < currentMessages.length) {
        // Показываем индикатор печати перед сообщением (кроме системных)
        if (currentMessages[messageIndex].type !== 'ticket_created' && 
            currentMessages[messageIndex].type !== 'ticket_closed') {
          setIsTyping(true)
          setTypingAuthor(currentMessages[messageIndex].authorName)
          
          setTimeout(() => {
            setIsTyping(false)
            setDisplayedMessages(prev => [...prev, currentMessages[messageIndex]])
            messageIndex++
            if (messageIndex < currentMessages.length) {
              messageTimers.push(setTimeout(showNextMessage, 1500 + Math.random() * 1000))
            }
          }, 1000 + Math.random() * 500)
        } else {
          // Системные сообщения показываем сразу
          setDisplayedMessages(prev => [...prev, currentMessages[messageIndex]])
          messageIndex++
          if (messageIndex < currentMessages.length) {
            messageTimers.push(setTimeout(showNextMessage, 800))
          }
        }
      }
    }
    
    // Начинаем показ сообщений через небольшую задержку
    messageTimers.push(setTimeout(showNextMessage, 500))
    
    return () => {
      messageTimers.forEach(timer => clearTimeout(timer))
      setIsTyping(false)
    }
  }, [currentMessages])

  // Автоматический переход к следующему этапу
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const allMessagesShown = displayedMessages.length === currentMessages.length && !isTyping
    
    if (!allMessagesShown) return
    
    let timeout: NodeJS.Timeout
    
    switch (currentStep) {
      case 'ticket_creation':
        timeout = setTimeout(() => {
          setCurrentStep('conversation')
        }, 3000)
        break
      case 'conversation':
        timeout = setTimeout(() => {
          setCurrentStep('closing')
        }, 5000)
        break
      case 'closing':
        timeout = setTimeout(() => {
          setCurrentStep('next_ticket')
        }, 3000)
        break
      case 'next_ticket':
        // Остаемся на этом этапе
        break
    }
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [currentStep, displayedMessages.length, currentMessages.length, isTyping, isAutoPlaying])

  const handleNextStep = () => {
    switch (currentStep) {
      case 'ticket_creation':
        setCurrentStep('conversation')
        break
      case 'conversation':
        setCurrentStep('closing')
        break
      case 'closing':
        setCurrentStep('next_ticket')
        break
      case 'next_ticket':
        // Уже на последнем этапе
        break
    }
  }

  const handleRestart = () => {
    setCurrentStep('ticket_creation')
    setIsAutoPlaying(true)
  }

  const getStepLabel = () => {
    switch (currentStep) {
      case 'ticket_creation':
        return 'Ticket Creation'
      case 'conversation':
        return 'Conversation'
      case 'closing':
        return 'Closing Ticket'
      case 'next_ticket':
        return 'Next Ticket'
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#36393f] text-[#dcddde]">
      {/* Header */}
      <div className="bg-[#2f3136] border-b border-[#202225] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#36393f] rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Discord DM Flow Demo</h1>
            <p className="text-xs text-[#72767d]">{getStepLabel()}</p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752C4] rounded text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            )}
          </button>
          <button
            onClick={handleNextStep}
            disabled={currentStep === 'next_ticket'}
            className="px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752C4] rounded text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRestart}
            className="px-3 py-1.5 bg-[#4f545c] hover:bg-[#5d6269] rounded text-sm font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat */}
        <div className="flex-1 flex flex-col bg-[#36393f]">
          <DiscordChat 
            messages={displayedMessages} 
            isTyping={isTyping}
            typingAuthor={typingAuthor}
          />
        </div>
      </div>
    </div>
  )
}
