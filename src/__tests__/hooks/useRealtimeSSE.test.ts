import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRealtimeSSE } from '@/hooks/useRealtimeSSE'

describe('useRealtimeSSE', () => {
  let listeners: Record<string, (event: any) => void> = {}
  let mockClose: ReturnType<typeof vi.fn>

  beforeEach(() => {
    listeners = {}
    mockClose = vi.fn()
    vi.stubGlobal('EventSource', vi.fn(function () {
      return {
        addEventListener: vi.fn((event: string, handler: any) => { listeners[event] = handler }),
        close: mockClose,
      }
    }))
  })

  it('should start with null data and no error', () => {
    const { result } = renderHook(() => useRealtimeSSE('/api/sse'))
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should update data on snapshot event', () => {
    const { result } = renderHook(() => useRealtimeSSE('/api/sse'))
    act(() => {
      listeners['snapshot']?.({ data: JSON.stringify({ today_total_amount: 500, today_total_count: 40, congestion_count: 2, timestamp: '2026-05-31', windows: [] }) })
    })
    expect(result.current.data?.today_total_amount).toBe(500)
    expect(result.current.error).toBeNull()
  })

  it('should set error on JSON parse failure', () => {
    const { result } = renderHook(() => useRealtimeSSE('/api/sse'))
    act(() => {
      listeners['snapshot']?.({ data: 'invalid-json' })
    })
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('数据解析失败')
  })

  it('should set error on SSE error event', () => {
    const { result } = renderHook(() => useRealtimeSSE('/api/sse'))
    act(() => {
      listeners['error']?.({})
    })
    expect(result.current.error).toBe('连接错误')
  })

  it('should close EventSource on unmount', () => {
    const { unmount } = renderHook(() => useRealtimeSSE('/api/sse'))
    unmount()
    expect(mockClose).toHaveBeenCalled()
  })

  it('should not connect when enabled is false', () => {
    const EventSourceSpy = vi.fn(() => ({ addEventListener: vi.fn(), close: vi.fn() }))
    vi.stubGlobal('EventSource', EventSourceSpy)
    renderHook(() => useRealtimeSSE('/api/sse', false))
    expect(EventSourceSpy).not.toHaveBeenCalled()
  })
})
