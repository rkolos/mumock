export interface Macro {
  id: number
  title: string
  text: string
  category: string
}

export interface MacroCategory {
  category: string
  items: Macro[]
}

export const mockMacros: MacroCategory[] = [
  {
    category: 'General',
    items: [
      {
        id: 101,
        title: 'Hello',
        text: 'Здравствуйте! Чем я могу вам помочь?',
        category: 'General',
      },
      {
        id: 102,
        title: 'Bye',
        text: 'Спасибо за обращение, хорошего дня!',
        category: 'General',
      },
      {
        id: 103,
        title: 'Thank You',
        text: 'Спасибо за ваше обращение. Мы ценим ваше терпение.',
        category: 'General',
      },
    ],
  },
  {
    category: 'Payment Issues',
    items: [
      {
        id: 201,
        title: 'Request Receipt',
        text: 'Пожалуйста, прикрепите чек об оплате.',
        category: 'Payment Issues',
      },
      {
        id: 202,
        title: 'Refund Policy',
        text: 'Возврат средств осуществляется в течение 3 рабочих дней.',
        category: 'Payment Issues',
      },
      {
        id: 203,
        title: 'Payment Processing',
        text: 'Ваш платеж обрабатывается. Обычно это занимает 1-2 рабочих дня.',
        category: 'Payment Issues',
      },
    ],
  },
  {
    category: 'Technical Support',
    items: [
      {
        id: 301,
        title: 'Reset Password',
        text: 'Для сброса пароля перейдите по ссылке в письме, которое мы отправили на ваш email.',
        category: 'Technical Support',
      },
      {
        id: 302,
        title: 'Clear Cache',
        text: 'Попробуйте очистить кэш браузера и перезагрузить страницу. Это часто решает проблемы с отображением.',
        category: 'Technical Support',
      },
      {
        id: 303,
        title: 'Check Connection',
        text: 'Проверьте ваше интернет-соединение. Если проблема сохраняется, попробуйте перезагрузить роутер.',
        category: 'Technical Support',
      },
    ],
  },
]

