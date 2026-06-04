import { http, HttpResponse } from 'msw'
import { createMockLoginResponse, createMockUserInfo, MOCK_LOGIN_REQUEST } from './fixtures/auth'
import { createMockOperationsDashboard, createMockNutritionDashboard, createMockStudentDashboard, createMockRealtimeDashboard } from './fixtures/dashboard'
import { createMockNutritionReport, createMockDailyNutrition, createMockGroupNutritionReport, createMockNutritionAlert, createMockDRIS } from './fixtures/nutrition'
import { createMockCanteen, createMockWindow, createMockDish, createMockStudent, createMockTransactionList } from './fixtures/resources'

export const BASE_URL = 'http://localhost:8000/api/v1'

export const handlers = [
  // Auth
  http.post('*/auth/login', async ({ request }) => {
    const body = await request.json() as any
    if (body.username === MOCK_LOGIN_REQUEST.username && body.password === MOCK_LOGIN_REQUEST.password) {
      return HttpResponse.json(createMockLoginResponse())
    }
    return HttpResponse.json({ code: 401, message: '用户名或密码错误' }, { status: 401 })
  }),

  http.get('*/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ code: 401, message: '未授权' }, { status: 401 })
    }
    return HttpResponse.json({ code: 200, message: 'success', data: createMockUserInfo() })
  }),

  // Dashboard
  http.get('*/dashboards/operations', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: createMockOperationsDashboard() })
  }),

  http.get('*/dashboards/nutrition', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: createMockNutritionDashboard() })
  }),

  http.get('*/dashboards/student', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: createMockStudentDashboard() })
  }),

  http.get('*/dashboards/realtime', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: createMockRealtimeDashboard() })
  }),

  http.get('*/transactions', () => {
    return HttpResponse.json({
      code: 200, message: 'success', data: createMockTransactionList(3),
      meta: { page: 1, page_size: 20, total: 45, total_pages: 3 }
    })
  }),

  http.get('*/transactions/stats', () => {
    return HttpResponse.json({
      code: 200, message: 'success',
      data: { total_count: 500, total_amount: 6250, avg_amount: 12.50, student_count: 300, window_count: 8, meal_type_breakdown: {} }
    })
  }),

  // Nutrition
  http.get('*/nutrition/personal', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: createMockNutritionReport() })
  }),

  http.get('*/nutrition/trend', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: [createMockDailyNutrition()] })
  }),

  http.get('*/nutrition/group', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: createMockGroupNutritionReport() })
  }),

  http.get('*/nutrition/alerts', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: [createMockNutritionAlert()] })
  }),

  http.get('*/nutrition/dris', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: createMockDRIS() })
  }),

  // Canteen
  http.get('*/canteens', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: [createMockCanteen()] })
  }),

  http.get('*/canteens/:canteenId/windows', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: [createMockWindow()] })
  }),

  // Window
  http.get('*/windows', () => {
    return HttpResponse.json({
      code: 200, message: 'success', data: [createMockWindow()],
      meta: { page: 1, page_size: 20, total: 1, total_pages: 1 }
    })
  }),

  http.get('*/windows/:id', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: createMockWindow() })
  }),

  http.post('*/windows', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({ code: 200, message: 'success', data: createMockWindow({ ...body }) })
  }),

  http.put('*/windows/:id', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({ code: 200, message: 'success', data: createMockWindow({ ...body }) })
  }),

  http.put('*/windows/:id/status', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({ code: 200, message: 'success', data: createMockWindow({ status: body.status }) })
  }),

  http.delete('*/windows/:id', () => {
    return HttpResponse.json({ code: 200, message: 'success' })
  }),

  // Dish
  http.get('*/dishes', () => {
    return HttpResponse.json({
      code: 200, message: 'success', data: [createMockDish()],
      meta: { page: 1, page_size: 20, total: 1, total_pages: 1 }
    })
  }),

  http.get('*/dishes/:id', () => {
    return HttpResponse.json({ code: 200, message: 'success', data: createMockDish() })
  }),

  http.post('*/dishes', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({ code: 200, message: 'success', data: createMockDish({ ...body }) })
  }),

  http.put('*/dishes/:id', async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({ code: 200, message: 'success', data: createMockDish({ ...body }) })
  }),

  http.delete('*/dishes/:id', () => {
    return HttpResponse.json({ code: 200, message: 'success' })
  }),

  // Student
  http.get('*/students', () => {
    return HttpResponse.json({
      code: 200, message: 'success', data: [createMockStudent()],
      meta: { page: 1, page_size: 20, total: 1, total_pages: 1 }
    })
  }),

  // AI
  http.post('*/ai/query', () => {
    return HttpResponse.json({
      code: 200, message: 'success',
      data: {
        sql: 'SELECT * FROM dishes',
        results: [{ dish_name: '宫保鸡丁', price: 15.00 }],
        columns: ['dish_name', 'price'],
        row_count: 1,
        execution_time_ms: 45
      }
    })
  }),
]
