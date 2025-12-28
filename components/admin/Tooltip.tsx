'use client'

import { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  children: React.ReactNode
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  asChild?: boolean
}

export default function Tooltip({ children, text, position = 'top', asChild = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      let triggerElement: HTMLElement | null = null
      
      if (asChild) {
        // Для asChild используем позицию мыши или находим реальный элемент
        if (mousePositionRef.current) {
          const tooltipRect = tooltipRef.current.getBoundingClientRect()
          let top = 0
          let left = 0

          switch (position) {
            case 'top':
              top = mousePositionRef.current.y - tooltipRect.height - 8
              left = mousePositionRef.current.x - tooltipRect.width / 2
              break
            case 'bottom':
              top = mousePositionRef.current.y + 8
              left = mousePositionRef.current.x - tooltipRect.width / 2
              break
            case 'left':
              top = mousePositionRef.current.y - tooltipRect.height / 2
              left = mousePositionRef.current.x - tooltipRect.width - 8
              break
            case 'right':
              top = mousePositionRef.current.y - tooltipRect.height / 2
              left = mousePositionRef.current.x + 8
              break
          }

          // Проверка границ экрана
          const padding = 8
          if (left < padding) left = padding
          if (left + tooltipRect.width > window.innerWidth - padding) {
            left = window.innerWidth - tooltipRect.width - padding
          }
          if (top < padding) top = padding
          if (top + tooltipRect.height > window.innerHeight - padding) {
            top = window.innerHeight - tooltipRect.height - padding
          }

          setTooltipPosition({ top, left })
          return
        }
        
        // Если позиция мыши не доступна, пытаемся найти реальный элемент
        if (wrapperRef.current) {
          const firstChild = wrapperRef.current.firstElementChild as HTMLElement
          if (firstChild) {
            triggerElement = firstChild
          }
        }
      } else if (wrapperRef.current) {
        triggerElement = wrapperRef.current
      }
      
      if (!triggerElement || !tooltipRef.current) return
      
      const triggerRect = triggerElement.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.left - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.right + 8
          break
      }

      // Проверка границ экрана
      const padding = 8
      if (left < padding) left = padding
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding
      }
      if (top < padding) top = padding
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding
      }

      setTooltipPosition({ top, left })
    }
  }, [isVisible, position, asChild])

  const handleMouseEnter = (e: React.MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY }
    setIsVisible(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isVisible && asChild) {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      // Пересчитываем позицию при движении мыши
      if (tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect()
        let top = 0
        let left = 0

        switch (position) {
          case 'top':
            top = e.clientY - tooltipRect.height - 8
            left = e.clientX - tooltipRect.width / 2
            break
          case 'bottom':
            top = e.clientY + 8
            left = e.clientX - tooltipRect.width / 2
            break
          case 'left':
            top = e.clientY - tooltipRect.height / 2
            left = e.clientX - tooltipRect.width - 8
            break
          case 'right':
            top = e.clientY - tooltipRect.height / 2
            left = e.clientX + 8
            break
        }

        const padding = 8
        if (left < padding) left = padding
        if (left + tooltipRect.width > window.innerWidth - padding) {
          left = window.innerWidth - tooltipRect.width - padding
        }
        if (top < padding) top = padding
        if (top + tooltipRect.height > window.innerHeight - padding) {
          top = window.innerHeight - tooltipRect.height - padding
        }

        setTooltipPosition({ top, left })
      }
    }
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
    mousePositionRef.current = null
  }

  if (asChild) {
    // Для абсолютно позиционированных элементов - добавляем обработчики на родителя
    return (
      <>
        <div
          ref={wrapperRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="contents"
        >
          {children}
        </div>
        {isVisible && (
          <div
            ref={tooltipRef}
            className="fixed z-[9999] px-2 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            {text}
            <div
              className="absolute w-0 h-0"
              style={{
                ...(position === 'top' && {
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid #111827',
                }),
                ...(position === 'bottom' && {
                  top: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderBottom: '4px solid #111827',
                }),
                ...(position === 'left' && {
                  right: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderLeft: '4px solid #111827',
                }),
                ...(position === 'right' && {
                  left: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderRight: '4px solid #111827',
                }),
              }}
            />
          </div>
        )}
      </>
    )
  }

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] px-2 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          {text}
          <div
            className="absolute w-0 h-0"
            style={{
              ...(position === 'top' && {
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid #111827',
              }),
              ...(position === 'bottom' && {
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderBottom: '4px solid #111827',
              }),
              ...(position === 'left' && {
                right: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderLeft: '4px solid #111827',
              }),
              ...(position === 'right' && {
                left: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderRight: '4px solid #111827',
              }),
            }}
          />
        </div>
      )}
    </div>
  )
}

