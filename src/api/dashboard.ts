import apiClient from './client'
import type {
  TransactionResponse,
  TransactionStatsResponse,
  OperationsDashboard,
  NutritionDashboard,
  StudentDashboard,
  RealtimeDashboard,
  CongestionAnalysisResponse,
  HeatmapItem,
} from '@/types'

export const transactionApi = {
  list: async (params?: {
    start_date?: string
    end_date?: string
    window_id?: string
    meal_type?: number
    payment_method?: number
    page?: number
    page_size?: number
  }): Promise<{ data: TransactionResponse[]; meta: any }> => {
    const res = await apiClient.get<any>('/transactions/', { params })
    return { data: res.data.data, meta: res.data.meta }
  },

  stats: async (params?: { start_date?: string; end_date?: string }): Promise<TransactionStatsResponse> => {
    const res = await apiClient.get<{ data: TransactionStatsResponse }>('/transactions/stats', { params })
    return res.data.data
  },
}

export const dashboardApi = {
  operations: async (params?: { date?: string }): Promise<OperationsDashboard> => {
    const res = await apiClient.get<{ data: OperationsDashboard }>('/dashboards/operations', {
      params: { target_date: params?.date },
    })
    return res.data.data
  },

  nutrition: async (params?: { date?: string }): Promise<NutritionDashboard> => {
    const res = await apiClient.get<{ data: NutritionDashboard }>('/dashboards/nutrition', {
      params: { target_date: params?.date },
    })
    return res.data.data
  },

  student: async (params?: { date?: string }): Promise<StudentDashboard> => {
    const res = await apiClient.get<{ data: StudentDashboard }>('/dashboards/student', {
      params: { target_date: params?.date },
    })
    return res.data.data
  },

  realtime: async (params?: { date?: string }): Promise<RealtimeDashboard> => {
    const res = await apiClient.get<{ data: RealtimeDashboard }>('/dashboards/realtime', {
      params: { target_date: params?.date },
    })
    return res.data.data
  },

  heatmap: async (date: string): Promise<HeatmapItem[]> => {
    const res = await apiClient.get<{ data: HeatmapItem[] }>('/queue/heatmap', {
      params: { date },
    })
    return res.data.data
  },

  queueAnalysis: async (params: { start_date: string; end_date: string }): Promise<CongestionAnalysisResponse> => {
    const res = await apiClient.get<{ data: CongestionAnalysisResponse }>('/queue/analysis', { params })
    return res.data.data
  },
}
