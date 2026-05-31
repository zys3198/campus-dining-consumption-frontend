import type {
  DailyNutrition,
  DRISStandard,
  GroupNutritionReport,
  NutritionAlert,
  NutritionReport,
} from '@/types'

export function createMockDailyNutrition(
  overrides?: Partial<DailyNutrition>,
): DailyNutrition {
  return {
    date: '2026-05-31',
    energy_kcal: 720,
    protein_g: 30,
    fat_g: 25,
    carbs_g: 90,
    fiber_g: 12,
    sodium_mg: 1500,
    ...overrides,
  }
}

export function createMockNutritionReport(
  overrides?: Partial<NutritionReport>,
): NutritionReport {
  return {
    student_hash: 'hash-abc123',
    start_date: '2026-05-01',
    end_date: '2026-05-31',
    daily: [createMockDailyNutrition()],
    averages: createMockDailyNutrition({ energy_kcal: 700 }),
    evaluations: {
      energy_kcal: '达标',
      protein_g: '达标',
      fat_g: '偏高',
      carbs_g: '达标',
    },
    total_consumption_count: 28,
    ...overrides,
  }
}

export function createMockDRIS(): DRISStandard[] {
  return [
    { nutrient: 'energy', male_value: 2400, female_value: 2100, unit: 'kcal' },
    { nutrient: 'protein', male_value: 65, female_value: 55, unit: 'g' },
    { nutrient: 'fat', male_value: 70, female_value: 60, unit: 'g' },
    { nutrient: 'carbs', male_value: 300, female_value: 260, unit: 'g' },
  ]
}

export function createMockNutritionAlert(
  overrides?: Partial<NutritionAlert>,
): NutritionAlert {
  return {
    student_hash: 'hash-abc123',
    department: '计算机学院',
    grade: '2023级',
    alert_type: '高脂',
    details: '近7天脂肪摄入偏高',
    ...overrides,
  }
}

export function createMockGroupNutritionReport(
  overrides?: Partial<GroupNutritionReport>,
): GroupNutritionReport {
  return {
    group_by: 'department',
    groups: [
      {
        group_key: '计算机学院',
        student_count: 120,
        avg_energy_kcal: 700,
        avg_protein_g: 30,
        avg_fat_g: 25,
        avg_carbs_g: 85,
      },
    ],
    ...overrides,
  }
}
