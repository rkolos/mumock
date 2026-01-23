'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Counter, CounterType, GuildConfig } from '../../../data/discordStats'

interface CounterDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (counter: Counter) => void
  counter?: Counter | null
  guild: GuildConfig
}

export default function CounterDialog({
  isOpen,
  onClose,
  onSave,
  counter,
  guild,
}: CounterDialogProps) {
  const [type, setType] = useState<CounterType>('MEMBERS')
  const [channelId, setChannelId] = useState<string>('')
  const [channelName, setChannelName] = useState<string>('')
  const [template, setTemplate] = useState<string>('')
  const [roleId, setRoleId] = useState<string>('')
  const [roleName, setRoleName] = useState<string>('')
  const [target, setTarget] = useState<number>(0)

  // Mock список каналов сервера
  const mockChannels = [
    { id: '999000111', name: 'members' },
    { id: '999000222', name: 'goal' },
    { id: '999000333', name: 'online' },
    { id: '999000444', name: 'welcome' },
    { id: '999000555', name: 'vip-members' },
  ]

  // Mock список ролей
  const mockRoles = [
    { id: 'role123', name: 'VIP' },
    { id: 'role456', name: 'Premium' },
    { id: 'role789', name: 'Moderator' },
  ]

  useEffect(() => {
    if (counter) {
      setType(counter.type)
      setChannelId(counter.channel_id)
      setChannelName(counter.channel_name || '')
      setTemplate(counter.template)
      setRoleId(counter.settings?.role_id || '')
      setRoleName(counter.settings?.role_name || '')
      setTarget(counter.settings?.target || 0)
    } else {
      // Сброс для нового счетчика
      setType('MEMBERS')
      setChannelId('')
      setChannelName('')
      setTemplate('')
      setRoleId('')
      setRoleName('')
      setTarget(0)
    }
  }, [counter, isOpen])

  const handleChannelChange = (channelIdValue: string) => {
    setChannelId(channelIdValue)
    const channel = mockChannels.find(c => c.id === channelIdValue)
    if (channel) {
      setChannelName(channel.name)
    }
  }

  const handleRoleChange = (roleIdValue: string) => {
    setRoleId(roleIdValue)
    const role = mockRoles.find(r => r.id === roleIdValue)
    if (role) {
      setRoleName(role.name)
    }
  }

  const handleSave = () => {
    if (!channelId || !template) {
      alert('Заполните все обязательные поля')
      return
    }

    const newCounter: Counter = {
      id: counter?.id || `c${Date.now()}`,
      type,
      channel_id: channelId,
      channel_name: channelName,
      template,
      settings: {},
    }

    if (type === 'ROLE_COUNT' && roleId) {
      newCounter.settings = {
        role_id: roleId,
        role_name: roleName,
      }
    }

    if (type === 'GOAL' && target > 0) {
      newCounter.settings = {
        target,
      }
    }

    onSave(newCounter)
  }

  const getDefaultTemplate = (counterType: CounterType) => {
    switch (counterType) {
      case 'MEMBERS':
        return '👥 Members: {count}'
      case 'ONLINE':
        return '🔴 Online: {count}'
      case 'ROLE_COUNT':
        return '⭐ {count}'
      case 'GOAL':
        return '🎯 Goal: {count}/{target}'
      default:
        return ''
    }
  }

  const handleTypeChange = (newType: CounterType) => {
    setType(newType)
    if (!template || template === getDefaultTemplate(type)) {
      setTemplate(getDefaultTemplate(newType))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {counter ? 'Редактировать счетчик' : 'Добавить счетчик'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as CounterType)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MEMBERS">Total Members</option>
              <option value="ONLINE">Online Members (Status)</option>
              <option value="ROLE_COUNT">Role Count</option>
              <option value="GOAL">Goal (Members/Boosts)</option>
            </select>
          </div>

          {/* Channel Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel <span className="text-red-500">*</span>
            </label>
            <select
              value={channelId}
              onChange={(e) => handleChannelChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите канал</option>
              {mockChannels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  #{channel.name}
                </option>
              ))}
            </select>
          </div>

          {/* Template Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Use variables: {count}, {target}"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Используйте переменные: <code className="bg-gray-100 px-1 py-0.5 rounded">{'{count}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{target}'}</code>
            </p>
          </div>

          {/* Conditional Settings: Role Selector for ROLE_COUNT */}
          {type === 'ROLE_COUNT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={roleId}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите роль</option>
                {mockRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Conditional Settings: Target Number for GOAL */}
          {type === 'GOAL' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                min="1"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Preview */}
          {template && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <p className="text-sm font-medium text-gray-900">
                {template
                  .replace('{count}', '1,204')
                  .replace('{target}', target > 0 ? target.toString() : '5000')}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}
