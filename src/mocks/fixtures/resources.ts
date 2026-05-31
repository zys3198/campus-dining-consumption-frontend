import type {
  CanteenListResponse,
  DishCreate,
  DishResponse,
  StudentRecord,
  TransactionDishItem,
  TransactionResponse,
  WindowResponse,
} from '@/types'

export function createMockCanteen(
  overrides?: Partial<CanteenListResponse>,
): CanteenListResponse {
  return {
    canteen_id: 'c001',
    name: '一食堂',
    location: '东校区',
    floor: 1,
    window_count: 8,
    ...overrides,
  }
}

export function createMockWindow(
  overrides?: Partial<WindowResponse>,
): WindowResponse {
  return {
    window_id: 'w001',
    window_name: '川菜窗口',
    canteen_id: 'c001',
    window_type: '自营',
    status: 1,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    canteen_name: '一食堂',
    ...overrides,
  }
}

export function createMockDish(
  overrides?: Partial<DishResponse>,
): DishResponse {
  return {
    dish_id: 'd001',
    dish_name: '宫保鸡丁',
    window_id: 'w001',
    price: 15.0,
    category: '热菜',
    tags: '辣,川菜',
    is_available: 1,
    is_deleted: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    window_name: '川菜窗口',
    canteen_id: 'c001',
    nutrition: {
      energy_kcal: 380,
      protein_g: 25,
      fat_g: 18,
      carbs_g: 30,
    },
    ...overrides,
  }
}

export const MOCK_DISH_CREATE: DishCreate = {
  dish_id: 'd-new',
  dish_name: '新菜品',
  window_id: 'w001',
  price: 12.0,
  category: '热菜',
}

export function createMockStudent(
  overrides?: Partial<StudentRecord>,
): StudentRecord {
  return {
    student_id: 's001',
    name: '张三',
    department: '计算机学院',
    grade: '2023级',
    ...overrides,
  }
}

export function createMockTransaction(
  overrides?: Partial<TransactionResponse>,
): TransactionResponse {
  const dishes: TransactionDishItem[] = [
    { dish_id: 'd001', dish_name: '宫保鸡丁', quantity: 1, subtotal: 15.0 },
    { dish_id: 'd002', dish_name: '米饭', quantity: 1, subtotal: 2.0 },
    { dish_id: 'd003', dish_name: '番茄蛋汤', quantity: 1, subtotal: 10.5 },
  ]
  return {
    txn_id: 'txn-001',
    student_hash: 'hash-abc123',
    window_id: 'w001',
    window_name: '川菜窗口',
    txn_time: '2026-05-31T12:30:00Z',
    total_amount: 27.5,
    meal_type: 2,
    payment_method: 1,
    dishes,
    ...overrides,
  }
}

export function createMockTransactionList(
  count: number,
): TransactionResponse[] {
  return Array.from({ length: count }, (_, i) =>
    createMockTransaction({ txn_id: `txn-${String(i + 1).padStart(3, '0')}` }),
  )
}
