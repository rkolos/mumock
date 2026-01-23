'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { GuildConfig, Counter, getCounterTypeIcon, getCounterTypeLabel } from '../../../data/discordStats'
import CounterDialog from './CounterDialog'

interface DiscordStatsCountersTabProps {
  guild: GuildConfig
  onGuildConfigChange: (guild: GuildConfig) => void
}

export default function DiscordStatsCountersTab({
  guild,
  onGuildConfigChange,
}: DiscordStatsCountersTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null)

  const maxCounters = guild.plan_limits.max_counters
  const currentCount = guild.active_counters.length
  const canAddCounter = currentCount < maxCounters

  const handleAddCounter = () => {
    setEditingCounter(null)
    setIsDialogOpen(true)
  }

  const handleEditCounter = (counter: Counter) => {
    setEditingCounter(counter)
    setIsDialogOpen(true)
  }

  const handleDeleteCounter = (counterId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот счетчик?')) {
      const updatedCounters = guild.active_counters.filter(c => c.id !== counterId)
      onGuildConfigChange({
        ...guild,
        active_counters: updatedCounters,
      })
    }
  }

  const handleSaveCounter = (counter: Counter) => {
    if (editingCounter) {
      // Редактирование существующего счетчика
      const updatedCounters = guild.active_counters.map(c =>
        c.id === editingCounter.id ? counter : c
      )
      onGuildConfigChange({
        ...guild,
        active_counters: updatedCounters,
      })
    } else {
      // Добавление нового счетчика
      onGuildConfigChange({
        ...guild,
        active_counters: [...guild.active_counters, counter],
      })
    }
    setIsDialogOpen(false)
    setEditingCounter(null)
  }

  const renderTemplatePreview = (counter: Counter) => {
    // Простой превью шаблона с mock данными
    let preview = counter.template
    preview = preview.replace('{count}', '1,204')
    if (counter.settings?.target) {
      preview = preview.replace('{target}', counter.settings.target.toString())
    }
    return preview
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Counters</h3>
          <p className="text-sm text-gray-500 mt-1">
            Управление динамическими названиями каналов
          </p>
        </div>
        <button
          onClick={handleAddCounter}
          disabled={!canAddCounter}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            canAddCounter
              ? 'bg-black text-white hover:bg-gray-900'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className="h-4 w-4" />
          Add Counter
        </button>
      </div>

      {!canAddCounter && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Достигнут лимит счетчиков ({currentCount} / {maxCounters}). Удалите существующий счетчик или обновите тарифный план.
          </p>
        </div>
      )}

      {guild.active_counters.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-2">Нет активных счетчиков</p>
          <p className="text-sm text-gray-400">
            Нажмите "Add Counter" для создания первого счетчика
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guild.active_counters.map((counter) => (
            <div
              key={counter.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCounterTypeIcon(counter.type)}</span>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {getCounterTypeLabel(counter.type)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      #{counter.channel_name || counter.channel_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditCounter(counter)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCounter(counter.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Template Preview:</p>
                <p className="text-sm font-medium text-gray-900">
                  {renderTemplatePreview(counter)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <CounterDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false)
            setEditingCounter(null)
          }}
          onSave={handleSaveCounter}
          counter={editingCounter}
          guild={guild}
        />
      )}
    </div>
  )
}
