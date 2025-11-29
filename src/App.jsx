import React, {useEffect, useState} from 'react'
import Header from './components/Header'
import Gallery from './components/Gallery'
import Reviews from './components/Reviews'
import Pricing from './components/Pricing'
import About from './components/About'
import FAQ from './components/FAQ'
import IdeaGenerator from './components/IdeaGenerator'
import { CONTACT_TG } from './config'

export default function App(){
  const [theme, setTheme] = useState('default')

  useEffect(()=>{
    // Telegram WebApp init
    if(window.Telegram?.WebApp){
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.MainButton.hide()
    }
    // apply theme to document root
    document.documentElement.removeAttribute('data-theme')
    if(theme === 'alt') document.documentElement.setAttribute('data-theme','alt')
  },[theme])

  function openChat(){
    // open t.me link to your username
    const url = `https://t.me/${CONTACT_TG}`
    // use WebApp API if available
    try {
      if(window.Telegram?.WebApp?.openTelegramLink){
        window.Telegram.WebApp.openTelegramLink(url)
      } else {
        window.open(url, '_blank')
      }
    } catch(e){
      window.open(url, '_blank')
    }
  }

  return (
    <div className="app">
      <Header theme={theme} setTheme={setTheme} />
      <Gallery />
      <Reviews />
      <Pricing />
      <About />
      <FAQ />
      <IdeaGenerator />
      <button className="order-fixed" onClick={openChat}>Оформить Заказ</button>
      <div className="footer muted">© {new Date().getFullYear()} Rivaldsg — All rights reserved</div>
    </div>
  )
}
