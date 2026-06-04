import type { ColumnFilterItem } from 'antd/es/table/interface'

/**
 * 从数据数组中提取不重复的非空值，生成 Ant Design Table filters 选项。
 * 自动排除 null / undefined / 空字符串。
 */
export function buildFilters<T>(items: T[], extractor: (item: T) => string | undefined | null): ColumnFilterItem[] {
  const seen = new Set<string>()
  for (const item of items) {
    const val = extractor(item)
    if (val != null && val !== '') seen.add(val)
  }
  return [...seen].map(v => ({ text: v, value: v }))
}

/**
 * 自然排序比较器（alphanumeric sort）。
 * 字母按字典序，数字按数值比较：W03 < W04 < W032, A10 > A2。
 */
export function naturalCompare(a: string, b: string): number {
  const segA = a.match(/\d+|\D+/g) ?? []
  const segB = b.match(/\d+|\D+/g) ?? []
  const len = Math.min(segA.length, segB.length)
  for (let i = 0; i < len; i++) {
    const sa = segA[i]
    const sb = segB[i]
    const aIsNum = /^\d+$/.test(sa)
    const bIsNum = /^\d+$/.test(sb)
    if (aIsNum && bIsNum) {
      const diff = Number(sa) - Number(sb)
      if (diff !== 0) return diff
    } else {
      const cmp = sa.localeCompare(sb)
      if (cmp !== 0) return cmp
    }
  }
  return segA.length - segB.length
}
