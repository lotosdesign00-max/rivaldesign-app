/**
 * Миграция данных из JSON файлов в Supabase
 * Запусти этот скрипт ОДИН РАЗ чтобы заполнить базу данных
 */

import { supabaseAdmin } from '../core/supabase/client'
import galleryData from '../data/gallery.json'
import reviewsData from '../data/reviews.json'

async function migrateData() {
  if (!supabaseAdmin) {
    console.error('❌ SUPABASE_SERVICE_KEY не настроен!')
    console.log('Добавь SUPABASE_SERVICE_KEY в .env файл')
    return
  }

  console.log('🚀 Начинаю миграцию данных в Supabase...\n')

  // 1. Галерея
  console.log('📦 Миграция галереи...')
  const galleryItems = galleryData.map(item => ({
    id: item.id,
    cat: item.category || 'Превью',
    title: item.title,
    desc: item.description || '',
    img: item.image,
    tags: item.tools || [],
    popular: false,
    views: 0,
  }))

  if (galleryItems.length > 0) {
    const { error } = await supabaseAdmin.from('gallery').upsert(galleryItems)
    if (error) {
      console.error('❌ Ошибка миграции галереи:', error)
    } else {
      console.log(`✅ Мигрировано ${galleryItems.length} работ`)
    }
  }

  // 2. Отзывы
  console.log('\n⭐ Миграция отзывов...')
  const reviewsItems = reviewsData.map(item => ({
    id: item.id,
    name: item.name,
    tg: item.tg || '',
    rating: item.rating || 5,
    text: item.text,
    time: item.time || 'недавно',
    verified: item.verified !== false,
  }))

  if (reviewsItems.length > 0) {
    const { error } = await supabaseAdmin.from('reviews').upsert(reviewsItems)
    if (error) {
      console.error('❌ Ошибка миграции отзывов:', error)
    } else {
      console.log(`✅ Мигрировано ${reviewsItems.length} отзывов`)
    }
  }

  console.log('\n✨ Миграция завершена!')
  console.log('Теперь проверь данные в Supabase Dashboard')
}

// Запуск
migrateData().catch(console.error)
