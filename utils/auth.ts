/**
 * Утилиты для проверки прав доступа
 * Мок-реализация для проверки ролей пользователя
 */

export type UserRole = 'Admin' | 'Manager' | 'Owner' | 'User'

/**
 * Проверяет, имеет ли пользователь права администратора
 * @param userRole - роль пользователя (опционально, по умолчанию проверяется из мок-данных)
 * @returns true если пользователь имеет права Admin, Manager или Owner
 */
export function hasAdminAccess(userRole?: UserRole): boolean {
  // Мок-проверка: если роль передана, проверяем её
  if (userRole) {
    return userRole === 'Admin' || userRole === 'Manager' || userRole === 'Owner'
  }

  // По умолчанию проверяем, что текущий пользователь имеет роль Owner
  // В реальном приложении это будет извлекаться из контекста/сессии
  const currentUserRole = 'Owner' as UserRole // Мок-данные из Header.tsx
  return currentUserRole === 'Admin' || currentUserRole === 'Manager' || currentUserRole === 'Owner'
}

