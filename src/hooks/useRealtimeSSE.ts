import { useEffect, useRef, useState } from 'react'
import type { RealtimeDashboard } from '@/types'

export function useRealtimeSSE(url: string, enabled: boolean = true) {
  const [data, setData] = useState<RealtimeDashboard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!enabled) return

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.addEventListener('snapshot', (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setData(parsed)
        setError(null)
      } catch {
        setError('数据解析失败')
      }
    })

    eventSource.addEventListener('error', () => {
      setError('连接错误')
    })

    return () => {
      eventSource.close()
    }
  }, [url, enabled])

  return { data, error }
}