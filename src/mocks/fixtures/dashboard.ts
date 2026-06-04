import type {
  NutritionDashboard,
  OperationsDashboard,
  RealtimeDashboard,
  StudentDashboard,
} from '@/types'

export function createMockOperationsDashboard(
  overrides?: Partial<OperationsDashboard>,
): OperationsDashboard {
  return {
    today: {
      total_amount: 15680.5,
      total_count: 1234,
      avg_per_person: 12.7,
      student_count: 987,
    },
    top_windows: [
      {
        window_id: 'w1',
        window_name: '川菜窗口',
        canteen_name: '一食堂',
        total_amount: 2340,
        transaction_count: 180,
      },
      {
        window_id: 'w2',
        window_name: '面食窗口',
        canteen_name: '一食堂',
        total_amount: 1980,
        transaction_count: 155,
      },
    ],
    meal_breakdown: [
      {
        meal_type: 1,
        meal_name: '早餐',
        count: 320,
        amount: 2560,
        percentage: 20.7,
      },
      {
        meal_type: 2,
        meal_name: '午餐',
        count: 560,
        amount: 7840,
        percentage: 63.5,
      },
      {
        meal_type: 3,
        meal_name: '晚餐',
        count: 280,
        amount: 3920,
        percentage: 15.8,
      },
    ],
    trend_7d: [
      { date: '2026-05-24', count: 1100, amount: 14000 },
      { date: '2026-05-25', count: 1200, amount: 15300 },
    ],
    congestion: [
      {
        window_id: 'w1',
        window_name: '川菜窗口',
        canteen_name: '一食堂',
        avg_wait_seconds: 180,
        max_queue_length: 15,
        sample_count: 50,
        level: '拥堵',
      },
      {
        window_id: 'w2',
        window_name: '面食窗口',
        canteen_name: '一食堂',
        avg_wait_seconds: 60,
        max_queue_length: 5,
        sample_count: 45,
        level: '轻微',
      },
    ],
    ...overrides,
  }
}

export function createMockStudentDashboard(
  overrides?: Partial<StudentDashboard>,
): StudentDashboard {
  return {
    student_name: '测试学生',
    department: '计算机学院',
    month_consumption_count: 45,
    month_total_amount: 567.8,
    month_avg_amount: 12.62,
    time_preference: '午餐',
    favorite_canteen: '一食堂',
    nutrition_score: '良好',
    ...overrides,
  }
}

export function createMockNutritionDashboard(
  overrides?: Partial<NutritionDashboard>,
): NutritionDashboard {
  return {
    avg_energy_kcal: 680,
    avg_protein_g: 28,
    avg_fat_g: 22,
    avg_carbs_g: 85,
    alert_count: 3,
    ...overrides,
  }
}

export function createMockRealtimeDashboard(
  overrides?: Partial<RealtimeDashboard>,
): RealtimeDashboard {
  return {
    timestamp: new Date().toISOString(),
    today_total_amount: 8900,
    today_total_count: 720,
    congestion_count: 3,
    windows: [],
    ...overrides,
  }
}
