import {
  SuggestionsConfig,
  defaultSuggestionsConfig,
  SuggestionCategory,
  NotificationTemplates,
  BannedUser,
  mockBannedUsers,
} from '../data/suggestionsConfig'

/**
 * Мок API для работы с настройками Suggestions
 * В будущем здесь будут реальные вызовы к бэкенду
 */

// Хранилище настроек в памяти (симуляция сервера)
let cachedSettings: SuggestionsConfig = { ...defaultSuggestionsConfig }

/**
 * Загружает настройки Suggestions с сервера
 * Lazy load - вызывается только при открытии модального окна
 * @returns Promise с конфигурацией настроек
 */
export async function fetchSuggestionsSettings(): Promise<SuggestionsConfig> {
  // Симулируем задержку сети
  await new Promise((resolve) => setTimeout(resolve, 300))

  // В реальном приложении здесь будет: return fetch('/api/v1/suggestions/config').then(res => res.json())
  return Promise.resolve({ ...cachedSettings })
}

/**
 * Сохраняет настройки Suggestions на сервер
 * @param config - конфигурация для сохранения
 * @returns Promise с сохраненной конфигурацией
 */
export async function saveSuggestionsSettings(
  config: SuggestionsConfig
): Promise<SuggestionsConfig> {
  // Симулируем задержку сети
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Валидация на фронтенде (дополнительная проверка)
  // Название категории: макс 30 символов
  for (const category of config.categories) {
    if (category.label.length > 30) {
      throw new Error(`Название категории "${category.label}" превышает лимит в 30 символов`)
    }
  }

  // Шаблон уведомления: макс 500 символов
  const notificationValues = Object.values(config.notifications)
  for (const template of notificationValues) {
    if (template.length > 500) {
      throw new Error('Шаблон уведомления превышает лимит в 500 символов')
    }
  }

  // Сохраняем в "хранилище"
  cachedSettings = { ...config }

  // В реальном приложении здесь будет:
  // return fetch('/api/v1/suggestions/config', {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(config)
  // }).then(res => res.json())

  return Promise.resolve({ ...cachedSettings })
}

/**
 * Получает дефолтные настройки
 * @returns Конфигурация по умолчанию
 */
export function getDefaultSuggestionsConfig(): SuggestionsConfig {
  return { ...defaultSuggestionsConfig }
}

// Хранилище забаненных пользователей в памяти (симуляция сервера)
let cachedBannedUsers: BannedUser[] = [...mockBannedUsers]

/**
 * Загружает список забаненных пользователей
 * Lazy load - вызывается только при открытии вкладки "Banned Users"
 * @param search - поисковый запрос по username или ID
 * @param page - номер страницы (для пагинации)
 * @param limit - количество результатов на странице
 * @returns Promise с массивом забаненных пользователей
 */
export async function fetchBannedUsers(
  search?: string,
  page: number = 1,
  limit: number = 20
): Promise<BannedUser[]> {
  // Симулируем задержку сети
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredUsers = [...cachedBannedUsers]

  // Применяем поиск
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim()
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower)
    )
  }

  // Пагинация
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // В реальном приложении здесь будет:
  // const params = new URLSearchParams({
  //   page: page.toString(),
  //   limit: limit.toString(),
  //   ...(search && { search })
  // })
  // return fetch(`/api/v1/suggestions/bans?${params}`).then(res => res.json())

  return Promise.resolve(paginatedUsers)
}

/**
 * Разбанивает пользователя (удаляет из списка забаненных)
 * @param userId - ID пользователя для разбана
 * @returns Promise, который резолвится при успехе
 */
export async function unbanUser(userId: string): Promise<void> {
  // Симулируем задержку сети
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Удаляем пользователя из хранилища
  cachedBannedUsers = cachedBannedUsers.filter((user) => user.id !== userId)

  // В реальном приложении здесь будет:
  // return fetch(`/api/v1/suggestions/bans/${userId}`, {
  //   method: 'DELETE'
  // }).then(res => {
  //   if (!res.ok) throw new Error('Failed to unban user')
  // })

  return Promise.resolve()
}

