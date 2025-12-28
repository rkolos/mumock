'use client'

import { X, Users } from 'lucide-react'
import { Category, SourceType } from '../../../data/categories'

interface AccessRolesTabProps {
  category: Category
  onAssignedRolesChange: (roles: string[]) => void
}

export default function AccessRolesTab({ category, onAssignedRolesChange }: AccessRolesTabProps) {
  const handleRemoveRole = (role: string) => {
    onAssignedRolesChange(category.assignedRoles.filter((r) => r !== role))
  }

  const handleRemoveSourceRole = (role: string) => {
    // TODO: Implement source role removal
    console.log('Remove source role:', role)
  }

  const getSourceRoles = (): string[] => {
    // Mock source roles based on source_type
    if (category.source_type === 'discord') {
      return ['@Support', '@Moderator', '@Admin']
    }
    return []
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          NinjaTickets Roles (Internal)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Список ролей внутри вашей админки, которые могут видеть и отвечать на тикеты этой категории.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {category.assignedRoles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300"
            >
              {role}
              <button
                onClick={() => handleRemoveRole(role)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {category.assignedRoles.length === 0 && (
            <p className="text-sm text-gray-500">Нет назначенных ролей</p>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
          <Users className="h-4 w-4" />
          <span>Manage Roles</span>
        </button>
      </div>

      {category.source_type === 'discord' && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Source Mapped Roles (External - Discord)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Список ролей Discord, которым разрешен просмотр канала тикета.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {getSourceRoles().map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300"
              >
                {role}
                <button
                  onClick={() => handleRemoveSourceRole(role)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
            <Users className="h-4 w-4" />
            <span>Manage Discord Roles</span>
          </button>
        </div>
      )}

      {category.source_type === 'web_widget' && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Source Mapped Roles (External - Web)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Настройки доступа по email-домену для веб-виджета.
          </p>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Функция в разработке</p>
          </div>
        </div>
      )}
    </div>
  )
}

