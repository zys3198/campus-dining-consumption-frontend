import { useMemo } from 'react'
import { Tooltip, Empty } from 'antd'
import type { HeatmapItem } from '@/types'

const LEVELS = [
  { key: 'green', color: '#10B981', label: '畅通' },
  { key: 'yellow', color: '#F59E0B', label: '轻微' },
  { key: 'red', color: '#EF4444', label: '拥堵' },
  { key: 'darkred', color: '#991B1B', label: '严重' },
] as const

const colorMap: Record<string, string> = Object.fromEntries(LEVELS.map(l => [l.key, l.color]))

/** Extract start time from slot string, e.g. "12:00" from "12:00-12:15". */
const startOfSlot = (slot: string) => slot.split('-')[0]

/** Congestion heatmap: rows = windows, columns = 15-min time slots. */
export function CongestionHeatmap({ data }: { data: HeatmapItem[] }) {
  const { windows, slots, matrix } = useMemo(() => {
    const windowOrder: string[] = []
    const windowNames: Record<string, string> = {}
    const slotSet = new Set<string>()
    for (const item of data) {
      if (!(item.window_id in windowNames)) {
        windowOrder.push(item.window_id)
        windowNames[item.window_id] = item.window_name
      }
      slotSet.add(item.time_slot)
    }
    const slots = Array.from(slotSet).sort()
    const matrix: Record<string, HeatmapItem> = {}
    for (const item of data) {
      matrix[`${item.window_id}::${item.time_slot}`] = item
    }
    return { windows: windowOrder.map(id => ({ id, name: windowNames[id] })), slots, matrix }
  }, [data])

  const hourHeaders = useMemo(() => {
    const hours: { label: string; span: number }[] = []
    for (const slot of slots) {
      const hour = startOfSlot(slot).split(':')[0] + ':00'
      const last = hours[hours.length - 1]
      if (last && last.label === hour) {
        last.span++
      } else {
        hours.push({ label: hour, span: 1 })
      }
    }
    return hours
  }, [slots])

  if (!data.length) {
    return <Empty description="当日暂无排队数据" style={{ padding: 32 }} />
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
        <thead>
          {/* Hour header row */}
          <tr>
            <th style={{ position: 'sticky', left: 0, zIndex: 1, background: '#fff', padding: '4px 8px', textAlign: 'left', fontSize: 12, borderBottom: '1px solid var(--gray-100)' }}>窗口</th>
            {hourHeaders.map(h => (
              <th key={h.label} colSpan={h.span} style={{ padding: '4px 2px', textAlign: 'center', fontSize: 11, color: 'var(--gray-500)', borderBottom: '1px solid var(--gray-100)' }}>
                {h.label}
              </th>
            ))}
          </tr>
          {/* Minute sub-header row */}
          <tr>
            <th style={{ position: 'sticky', left: 0, zIndex: 1, background: '#fff', padding: '2px 8px', borderBottom: '1px solid var(--gray-100)' }} />
            {slots.map(slot => (
              <th key={slot} style={{ padding: '2px 0', textAlign: 'center', fontSize: 10, color: 'var(--gray-400)', borderBottom: '1px solid var(--gray-100)', minWidth: 28 }}>
                {startOfSlot(slot).split(':')[1]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {windows.map(w => (
            <tr key={w.id}>
              <td style={{ position: 'sticky', left: 0, zIndex: 1, background: '#fff', padding: '4px 8px', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', borderBottom: '1px solid var(--gray-100)' }}>
                {w.name}
              </td>
              {slots.map(slot => {
                const cell = matrix[`${w.id}::${slot}`]
                if (!cell) {
                  return <td key={slot} style={{ padding: 0, borderBottom: '1px solid var(--gray-100)' }} />
                }
                const bg = colorMap[cell.congestion_color ?? ''] || '#E4E8EE'
                const level = cell.congestion_level ?? '未知'
                return (
                  <td key={slot} style={{ padding: 0, borderBottom: '1px solid var(--gray-100)' }}>
                    <Tooltip title={`${w.name} ${slot}：平均等待 ${cell.avg_wait_duration.toFixed(0)}s（${level}）`}>
                      <div style={{ height: 24, minWidth: 28, background: bg, borderRadius: 2 }} />
                    </Tooltip>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, fontSize: 12, color: 'var(--gray-500)' }}>
        <span>拥堵等级：</span>
        {LEVELS.map(l => (
          <span key={l.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 2, background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  )
}
