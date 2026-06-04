import apiClient from './client'
import type {
  APIResponse,
  CanteenListResponse,
  CanteenCreate,
  CanteenUpdate,
  WindowResponse,
  DishResponse,
  DishCreate,
  DishUpdate,
  PaginationParams,
  StudentRecord,
  StudentUpdate,
  ImportResponse,
} from '@/types'

export const canteenApi = {
  list: async (): Promise<CanteenListResponse[]> => {
    const res = await apiClient.get<APIResponse<CanteenListResponse[]>>('/canteens/')
    return res.data.data
  },

  get: async (canteenId: string): Promise<CanteenListResponse> => {
    const res = await apiClient.get<APIResponse<CanteenListResponse>>(`/canteens/${canteenId}`)
    return res.data.data
  },

  create: async (data: CanteenCreate): Promise<CanteenListResponse> => {
    const res = await apiClient.post<APIResponse<CanteenListResponse>>('/canteens/', data)
    return res.data.data
  },

  update: async (canteenId: string, data: CanteenUpdate): Promise<CanteenListResponse> => {
    const res = await apiClient.put<APIResponse<CanteenListResponse>>(`/canteens/${canteenId}`, data)
    return res.data.data
  },

  listWindows: async (canteenId: string): Promise<WindowResponse[]> => {
    const res = await apiClient.get<APIResponse<WindowResponse[]>>(`/canteens/${canteenId}/windows`)
    return res.data.data
  },
}

export const windowApi = {
  list: async (params?: { canteen_id?: string; status?: number } & PaginationParams): Promise<{ data: WindowResponse[]; meta: any }> => {
    const res = await apiClient.get<APIResponse<WindowResponse[]>>('/windows/', { params })
    return { data: res.data.data, meta: res.data.meta }
  },

  get: async (windowId: string): Promise<WindowResponse> => {
    const res = await apiClient.get<APIResponse<WindowResponse>>(`/windows/${windowId}`)
    return res.data.data
  },

  create: async (data: Partial<WindowResponse>): Promise<WindowResponse> => {
    const res = await apiClient.post<APIResponse<WindowResponse>>('/windows/', data)
    return res.data.data
  },

  update: async (windowId: string, data: Partial<WindowResponse>): Promise<WindowResponse> => {
    const res = await apiClient.put<APIResponse<WindowResponse>>(`/windows/${windowId}`, data)
    return res.data.data
  },

  updateStatus: async (windowId: string, status: number): Promise<WindowResponse> => {
    const res = await apiClient.put<APIResponse<WindowResponse>>(`/windows/${windowId}/status`, { status })
    return res.data.data
  },
}

export const dishApi = {
  list: async (params?: {
    window_id?: string
    category?: string
    is_available?: number
    keyword?: string
  } & PaginationParams): Promise<{ data: DishResponse[]; meta: any }> => {
    const res = await apiClient.get<APIResponse<DishResponse[]>>('/dishes/', { params })
    return { data: res.data.data, meta: res.data.meta }
  },

  get: async (dishId: string): Promise<DishResponse> => {
    const res = await apiClient.get<APIResponse<DishResponse>>(`/dishes/${dishId}`)
    return res.data.data
  },

  create: async (data: DishCreate): Promise<DishResponse> => {
    const res = await apiClient.post<APIResponse<DishResponse>>('/dishes/', data)
    return res.data.data
  },

  update: async (dishId: string, data: DishUpdate): Promise<DishResponse> => {
    const res = await apiClient.put<APIResponse<DishResponse>>(`/dishes/${dishId}`, data)
    return res.data.data
  },

  delete: async (dishId: string): Promise<void> => {
    await apiClient.delete(`/dishes/${dishId}`)
  },
}

export const studentApi = {
  list: async (params?: PaginationParams): Promise<{ data: StudentRecord[]; meta: any }> => {
    const res = await apiClient.get<APIResponse<StudentRecord[]>>('/students/', { params })
    return { data: res.data.data, meta: res.data.meta }
  },

  update: async (studentId: string, data: StudentUpdate): Promise<StudentRecord> => {
    const res = await apiClient.put<APIResponse<StudentRecord>>(`/students/${studentId}`, data)
    return res.data.data
  },
}

export const importApi = {
  transactions: async (file: File): Promise<ImportResponse> => {
    const form = new FormData()
    form.append('file', file)
    const res = await apiClient.post<APIResponse<ImportResponse>>('/transactions/batch', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120_000,
    })
    return res.data.data
  },

  students: async (file: File): Promise<ImportResponse> => {
    const form = new FormData()
    form.append('file', file)
    const res = await apiClient.post<APIResponse<ImportResponse>>('/students/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120_000,
    })
    return res.data.data
  },

  queueRecords: async (file: File): Promise<ImportResponse> => {
    const form = new FormData()
    form.append('file', file)
    const res = await apiClient.post<APIResponse<ImportResponse>>('/queue/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120_000,
    })
    return res.data.data
  },
}
