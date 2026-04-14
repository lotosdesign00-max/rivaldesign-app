import React from 'react'
import { createRoot } from 'react-dom/client'
import AdminApp from './AdminApp'

// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp
if (tg) {
  tg.ready()
  tg.expand()
  
  // Установка цветов под тему Telegram
  document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#05070b')
  document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#f4f4f5')
}

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
)
