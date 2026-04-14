import React, { useState, useEffect } from 'react'
import { supabase } from '../core/supabase/client'
import galleryFallback from '../data/gallery.json'
import reviewsFallback from '../data/reviews.json'

/**
 * Компонент-обёртка для загрузки данных из Supabase
 * Если Supabase недоступен - использует fallback из JSON
 */
export function withSupabaseData(WrappedComponent) {
  return function SupabaseDataWrapper(props) {
    const [data, setData] = useState({
      gallery: galleryFallback,
      reviews: reviewsFallback,
      loading: true,
    })

    useEffect(() => {
      let mounted = true

      async function loadData() {
        try {
          // Загружаем галерею
          const { data: gallery, error: galleryError } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false })

          // Загружаем отзывы
          const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false })

          if (mounted) {
            setData({
              gallery: galleryError ? galleryFallback : gallery || galleryFallback,
              reviews: reviewsError ? reviewsFallback : reviews || reviewsFallback,
              loading: false,
            })
          }
        } catch (error) {
          console.warn('Supabase недоступен, используем fallback:', error)
          if (mounted) {
            setData({
              gallery: galleryFallback,
              reviews: reviewsFallback,
              loading: false,
            })
          }
        }
      }

      loadData()

      return () => {
        mounted = false
      }
    }, [])

    return <WrappedComponent {...props} supabaseData={data} />
  }
}

/**
 * Хук для использования Supabase данных в компонентах
 */
export function useSupabaseContent(table, fallback = []) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false })

        if (mounted) {
          setData(error ? fallback : result || fallback)
          setLoading(false)
        }
      } catch (error) {
        console.warn(`Supabase ${table} error:`, error)
        if (mounted) {
          setData(fallback)
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [table])

  return { data, loading }
}

export default withSupabaseData
