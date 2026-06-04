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
