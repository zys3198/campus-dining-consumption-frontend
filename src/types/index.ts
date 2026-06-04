// API Response wrapper
export interface APIResponse<T> {
  code: number
  message: string
  data: T
  meta?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface PaginationParams {
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Auth types
export type UserRole = 'admin' | 'manager' | 'student'

export interface UserInfo {
  user_id: string
  role: UserRole
  name: string
  scope: string | null
  student_hash: string | null
  department: string | null
}

export interface StudentRecord {
  student_id: string
  name: string
  department: string
  grade: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: UserInfo
}

// Canteen types
export interface CanteenResponse {
  canteen_id: string
  name: string
  location?: string
  floor?: number
  created_at: string
  updated_at: string
}

export interface CanteenListResponse {
  canteen_id: string
  name: string
  location?: string
  floor?: number
  window_count: number
}

export interface CanteenCreate {
  name: string
  location?: string
  floor?: number
}

export interface CanteenUpdate {
  name?: string
  location?: string
  floor?: number
}

// Window types
export interface WindowResponse {
  window_id: string
  window_name: string
  canteen_id: string
  window_type: string
  status: number
  created_at: string
  updated_at: string
  canteen_name?: string
}

// Dish types
export interface NutritionInfo {
  energy_kcal: number
  protein_g: number
  fat_g: number
  carbs_g: number
  fiber_g?: number
  sodium_mg?: number
}

export interface DishResponse {
  dish_id: string
  dish_name: string
  window_id: string
  price: number
  category: string
  tags?: string
  is_available: number
  is_deleted: number
  created_at: string
  updated_at: string
  window_name?: string
  canteen_id?: string
  nutrition?: NutritionInfo
}

export interface DishCreate {
  dish_id: string
  dish_name: string
  window_id: string
  price: number
  category: string
  tags?: string
  is_available?: number
  nutrition?: Partial<NutritionInfo>
}

export interface DishUpdate {
  dish_name?: string
  price?: number
  category?: string
  tags?: string
  is_available?: number
}

// Transaction types
export interface TransactionDishItem {
  dish_id: string
  dish_name?: string
  quantity: number
  subtotal: number
}

export interface TransactionResponse {
  txn_id: string
  student_hash: string
  window_id: string
  window_name?: string
  txn_time: string
  total_amount: number
  meal_type: number
  payment_method?: number
  dishes: TransactionDishItem[]
}

export interface TransactionStatsResponse {
  total_count: number
  total_amount: number
  avg_amount: number
  student_count: number
  window_count: number
  meal_type_breakdown: Record<string, number>
}

// Dashboard types
export interface OperationsDashboard {
  today: TodayOverview
  top_windows: WindowRankItem[]
  meal_breakdown: MealTypeBreakdown[]
  trend_7d: TrendDataPoint[]
  congestion: CongestionItem[]
}

export interface TodayOverview {
  total_amount: number
  total_count: number
  avg_per_person: number
  student_count: number
}

export interface WindowRankItem {
  window_id: string
  window_name: string
  canteen_name: string
  total_amount: number
  transaction_count: number
}

export interface MealTypeBreakdown {
  meal_type: number
  meal_name: string
  count: number
  amount: number
  percentage: number
}

export interface TrendDataPoint {
  date: string
  count: number
  amount: number
}

export interface CongestionItem {
  window_id: string
  window_name: string
  canteen_name: string
  avg_wait_seconds: number
  max_queue_length: number
  sample_count: number
  level: '畅通' | '轻微' | '拥堵' | '严重'
}

export interface NutritionDashboard {
  avg_energy_kcal: number
  avg_protein_g: number
  avg_fat_g: number
  avg_carbs_g: number
  alert_count: number
}

export interface StudentDashboard {
  student_name: string
  department: string
  month_consumption_count: number
  month_total_amount: number
  month_avg_amount: number
  time_preference: '早餐' | '午餐' | '晚餐' | '夜宵' | null
  favorite_canteen: string | null
  nutrition_score: '良好' | '一般' | '需改善' | null
}

export interface RealtimeDashboard {
  timestamp: string
  today_total_amount: number
  today_total_count: number
  congestion_count: number
  windows: CongestionItem[]
}

export interface HeatmapItem {
  window_id: string
  window_name: string
  time_slot: string
  avg_wait_duration: number
  congestion_level: string | null
  congestion_color: string | null
}

// Nutrition types
export interface DailyNutrition {
  date: string | Date
  energy_kcal: number
  protein_g: number
  fat_g: number
  carbs_g: number
  fiber_g?: number
  sodium_mg?: number
  protein_ratio?: number
  fat_ratio?: number
  carbs_ratio?: number
}

export interface NutritionReport {
  student_hash: string
  start_date: string
  end_date: string
  daily: DailyNutrition[]
  averages: DailyNutrition
  evaluations: Record<string, '偏低' | '达标' | '偏高'>
  total_consumption_count: number
}

export interface DRISStandard {
  nutrient: string
  male_value: number
  female_value: number
  unit: string
}

export interface NutritionAlert {
  student_hash: string
  department?: string
  grade?: string
  alert_type: string
  details: string
}

export interface GroupNutritionStats {
  group_key: string
  student_count: number
  avg_energy_kcal: number
  avg_protein_g: number
  avg_fat_g: number
  avg_carbs_g: number
  avg_fiber_g?: number
  avg_sodium_mg?: number
}

export interface GroupNutritionReport {
  group_by: 'department' | 'grade'
  groups: GroupNutritionStats[]
}

export interface StudentUpdate {
  name?: string
  department?: string
  grade?: string
}

// Data import types
export interface ImportResponse {
  imported: number
  skipped?: number
  error_count: number
  error_details?: string[]
}

// Queue analysis types
export interface CongestionTopItem {
  window_id: string
  window_name: string
  avg_wait_duration: number
  record_count: number
}

export interface CongestionPeakItem {
  hour: number
  record_count: number
  avg_wait_duration: number
}

export interface WindowEfficiencyItem {
  window_id: string
  window_name: string
  canteen_name: string
  avg_wait_duration: number
  max_wait_duration: number
  record_count: number
}

export interface CongestionDistributionItem {
  level: string
  count: number
  percentage: number
}

export interface CongestionAnalysisResponse {
  tops: CongestionTopItem[]
  peaks: CongestionPeakItem[]
  peak_hours: CongestionPeakItem[]
  top_congested_windows: CongestionTopItem[]
  window_efficiency: WindowEfficiencyItem[]
  congestion_distribution: CongestionDistributionItem[]
}
