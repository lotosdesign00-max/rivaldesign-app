import { useState, useEffect, useCallback } from 'react'
import { supabase } from './client'

// Хук для чтения данных из Supabase
export function useSupabaseData(table, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      let query = supabase.from(table).select('*')
      
      // Применяем опции
      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? false 
        })
      }
      if (options.limit) {
        query = query.limit(options.limit)
      }
      if (options.filter) {
        query = query.eq(options.filter.column, options.filter.value)
      }
      if (options.match) {
        query = query.match(options.match)
      }
      
      const { data: result, error } = await query
      
      if (error) throw error
      setData(result || [])
    } catch (err) {
      setError(err.message)
      console.error(`Error fetching ${table}:`, err)
    } finally {
      setLoading(false)
    }
  }, [table, JSON.stringify(options)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Подписка на изменения в реальном времени
  useEffect(() => {
    if (!options.realtime) return

    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => fetchData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, fetchData, options.realtime])

  return { data, loading, error, refetch: fetchData }
}

// Хук для одной записи
export function useSupabaseRecord(table, id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      
      const { data: result, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [table, id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export default useSupabaseData
