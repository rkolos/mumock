'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { GuildConfig } from '../../../data/discordStats'

interface ServerSelectorProps {
  servers: GuildConfig[]
  selectedServerId: string | null
  onServerChange: (serverId: string | null) => void
  linkedServerIds?: string[]
}

export default function ServerSelector({ servers, selectedServerId, onServerChange, linkedServerIds = [] }: ServerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const selectedServer = servers.find(s => s.guild_id === selectedServerId)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[200px]"
      >
        {selectedServer ? (
          <>
            {selectedServer.icon ? (
              <img
                src={selectedServer.icon}
                alt={selectedServer.name}
                className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className={`h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 ${
                selectedServer.icon ? 'hidden' : ''
              }`}
            >
              <span className="text-white text-xs font-semibold">
                {selectedServer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="flex-1 text-left text-sm font-medium text-gray-900 truncate">
              {selectedServer.name}
            </span>
          </>
        ) : (
          <span className="flex-1 text-left text-sm text-gray-500">Select server</span>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {servers.map((server) => (
            <button
              key={server.guild_id}
              onClick={() => {
                onServerChange(server.guild_id)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                selectedServerId === server.guild_id ? 'bg-blue-50' : ''
              }`}
            >
              {server.icon ? (
                <img
                  src={server.icon}
                  alt={server.name}
                  className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
              ) : null}
              <div
                className={`h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 ${
                  server.icon ? 'hidden' : ''
                }`}
              >
                <span className="text-white text-xs font-semibold">
                  {server.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="flex-1 text-sm text-gray-900">{server.name}</span>
              <div className="flex items-center gap-2">
                {!linkedServerIds.includes(server.guild_id) && (
                  <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                    Не подключен
                  </span>
                )}
                {selectedServerId === server.guild_id && (
                  <span className="text-blue-600 text-xs">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
