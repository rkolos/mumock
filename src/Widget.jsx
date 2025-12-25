import { useState } from 'react'
import config from './widget-config.json'

function Widget() {
  const [currentState, setCurrentState] = useState('collapsed')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleStateChange = (newState) => {
    setCurrentState(newState)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Спасибо за ваш отзыв!')
    setFormData({ name: '', email: '', message: '' })
    handleStateChange('collapsed')
  }

  const renderCollapsed = () => {
    const state = config.states.collapsed
    return (
      <button
        onClick={() => handleStateChange(state.actions.onClick)}
        className={`${state.backgroundColor} ${state.hoverColor} ${state.borderRadius} w-15 h-15 flex items-center justify-center text-white text-2xl transition-colors`}
        style={{
          width: state.width,
          height: state.height
        }}
        aria-label={state.display.text}
      >
        {state.display.icon}
      </button>
    )
  }

  const renderOpen = () => {
    const state = config.states.open
    return (
      <div
        className={`${state.backgroundColor} ${state.borderRadius} ${state.shadow} flex flex-col`}
        style={{
          width: state.width,
          height: state.height
        }}
      >
        <div className={`${state.header.backgroundColor} ${state.header.textColor} ${state.header.padding} ${state.borderRadius} ${state.borderRadius.replace('rounded-lg', 'rounded-t-lg')} flex justify-between items-center`}>
          <h2 className="text-lg font-semibold">{state.header.title}</h2>
          <button
            onClick={() => handleStateChange(state.header.closeButton.action)}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Закрыть"
          >
            {state.header.closeButton.text}
          </button>
        </div>
        <div className={`${state.content.padding} flex-1 overflow-y-auto`}>
          {state.content.messages.map((message, index) => (
            <div key={index} className="mb-4">
              <p className="text-gray-700">{message.text}</p>
            </div>
          ))}
        </div>
        <div className={`${state.footer.backgroundColor} ${state.footer.padding} rounded-b-lg`}>
          <button
            onClick={() => handleStateChange(state.footer.button.action)}
            className={`${state.footer.button.backgroundColor} ${state.footer.button.hoverColor} ${state.footer.button.textColor} w-full py-2 px-4 rounded-lg font-medium transition-colors`}
          >
            {state.footer.button.text}
          </button>
        </div>
      </div>
    )
  }

  const renderFeedback = () => {
    const state = config.states.feedback

    return (
      <div
        className={`${state.backgroundColor} ${state.borderRadius} ${state.shadow} flex flex-col`}
        style={{
          width: state.width,
          height: state.height
        }}
      >
        <div className={`${state.header.backgroundColor} ${state.header.textColor} ${state.header.padding} rounded-t-lg flex justify-between items-center`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStateChange(state.header.backButton.action)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              aria-label="Назад"
            >
              {state.header.backButton.text}
            </button>
            <h2 className="text-lg font-semibold">{state.header.title}</h2>
          </div>
          <button
            onClick={() => handleStateChange(state.header.closeButton.action)}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Закрыть"
          >
            {state.header.closeButton.text}
          </button>
        </div>
        <div className={`${state.content.padding} flex-1 overflow-y-auto`}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {state.content.form.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={field.rows}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className={`${state.content.form.submitButton.backgroundColor} ${state.content.form.submitButton.hoverColor} ${state.content.form.submitButton.textColor} w-full py-2 px-4 rounded-lg font-medium transition-colors`}
            >
              {state.content.form.submitButton.text}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const renderCurrentState = () => {
    switch (currentState) {
      case 'collapsed':
        return renderCollapsed()
      case 'open':
        return renderOpen()
      case 'feedback':
        return renderFeedback()
      default:
        return renderCollapsed()
    }
  }

  return (
    <div
      className="fixed"
      style={{
        bottom: config.position.bottom,
        right: config.position.right,
        zIndex: config.position.zIndex
      }}
    >
      {renderCurrentState()}
    </div>
  )
}

export default Widget

