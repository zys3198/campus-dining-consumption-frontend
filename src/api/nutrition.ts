import apiClient from './client'
import type { DailyNutrition, NutritionReport, DRISStandard, NutritionAlert, GroupNutritionReport } from '@/types'

export const nutritionApi = {
  getPersonal: async (params?: {
    start_date?: string
    end_date?: string
  }): Promise<NutritionReport> => {
    const res = await apiClient.get<{ data: NutritionReport }>('/nutrition/personal', { params })
    return res.data.data
  },

  getTrend: async (params?: { days?: number }): Promise<DailyNutrition[]> => {
    const res = await apiClient.get<{ data: DailyNutrition[] }>('/nutrition/trend', { params })
    return res.data.data
  },

  getGroup: async (params: {
    group_by: 'department' | 'grade'
    start_date?: string
    end_date?: string
  }): Promise<GroupNutritionReport> => {
    const res = await apiClient.get<{ data: GroupNutritionReport }>('/nutrition/group', { params })
    return res.data.data
  },

  getAlerts: async (params?: { date?: string }): Promise<NutritionAlert[]> => {
    const res = await apiClient.get<{ data: NutritionAlert[] }>('/nutrition/alerts', { params })
    return res.data.data
  },

  getDRIs: async (): Promise<DRISStandard[]> => {
    const res = await apiClient.get<{ data: DRISStandard[] }>('/nutrition/dris')
    return res.data.data
  },
}