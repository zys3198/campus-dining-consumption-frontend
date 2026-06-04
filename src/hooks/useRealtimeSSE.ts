import { useEffect, useRef, useState, useCallback } from 'react'
import type { RealtimeDashboard } from '@/types'

const MAX_RETRIES = 20
const MAX_RETRY_DELAY = 30_000
const INITIAL_RETRY_DELAY = 1_000

export function useRealtimeSSE(url: string, enabled: boolean = true) {
  const [data, setData] = useState<RealtimeDashboard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const retryCountRef = useRef(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const connect = useCallback(() => {
    if (!enabled) return

    const eventSource = new EventSource(url)

    eventSource.addEventListener('snapshot', (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setData(parsed)
        setError(null)
        retryCountRef.current = 0 // 连接成功，重置重试计数
      } catch {
        setError('数据解析失败')
      }
    })

    eventSource.addEventListener('error', () => {
      eventSource.close()
      setError('连接断开，正在重连...')

      // 指数退避重连
      retryCountRef.current += 1
      if (retryCountRef.current >= MAX_RETRIES) {
        setError('连接失败，请刷新页面重试')
        return
      }
      const delay = Math.min(
        INITIAL_RETRY_DELAY * 2 ** retryCountRef.current,
        MAX_RETRY_DELAY,
      )
      reconnectTimerRef.current = setTimeout(() => {
        connect()
      }, delay)
    })

    // 返回清理函数
    return () => {
      eventSource.close()
    }
  }, [url, enabled])

  useEffect(() => {
    const cleanup = connect()

    return () => {
      cleanup?.()
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
    }
  }, [connect])

  return { data, error }
}
