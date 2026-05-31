import apiClient from './client'
import type { APIResponse } from '@/types'

export interface AISqlQueryRequest {
  question: string
  use_cache?: boolean
}

export interface AISqlQueryResponse {
  sql: string
  results: any[]
  columns: string[]
  row_count: number
  execution_time_ms: number
}

export const aiApi = {
  query: async (data: AISqlQueryRequest): Promise<AISqlQueryResponse> => {
    const res = await apiClient.post<APIResponse<AISqlQueryResponse>>('/ai/query', data)
    return res.data.data
  },
}