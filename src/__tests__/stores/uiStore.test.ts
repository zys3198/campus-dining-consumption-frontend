import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/stores/uiStore'

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarCollapsed: false })
  })

  it('should start with sidebar not collapsed', () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(false)
  })

  it('should toggle sidebar collapsed state', () => {
    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarCollapsed).toBe(true)

    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarCollapsed).toBe(false)
  })
})
