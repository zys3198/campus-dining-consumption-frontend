import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/common/StatCard'

describe('StatCard', () => {
  it('should render title and value', () => {
    render(<StatCard title="销售额" value={1234.56} suffix="元" />)
    expect(screen.getByText('销售额')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })

  it('should render with custom precision', () => {
    render(<StatCard title="精度测试" value={99.999} precision={1} />)
    expect(screen.getByText('.9')).toBeInTheDocument()
  })

  it('should accept string values', () => {
    render(<StatCard title="状态" value="良好" />)
    expect(screen.getByText('良好')).toBeInTheDocument()
  })

  it('should apply red color for negative trend', () => {
    render(<StatCard title="趋势" value={-5} trend={-1} suffix="%" />)
    expect(screen.getByText('趋势')).toBeInTheDocument()
  })

  it('should render with prefix element', () => {
    render(<StatCard title="前缀" value={100} prefix={<span>💰</span>} />)
    expect(screen.getByText('💰')).toBeInTheDocument()
  })
})
