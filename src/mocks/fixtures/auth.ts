import type { LoginRequest, LoginResponse, UserInfo } from '@/types'

export function createMockUserInfo(overrides?: Partial<UserInfo>): UserInfo {
  return {
    user_id: 'test-user-001',
    role: 'student',
    name: '测试学生',
    scope: null,
    student_hash: 'hash-abc123',
    department: '计算机学院',
    ...overrides,
  }
}

export function createMockLoginResponse(
  overrides?: Partial<LoginResponse>,
): LoginResponse {
  return {
    access_token: 'mock-jwt-token-xyz',
    token_type: 'bearer',
    expires_in: 3600,
    user: createMockUserInfo(),
    ...overrides,
  }
}

export const MOCK_LOGIN_REQUEST: LoginRequest = {
  username: 'testuser',
  password: 'testpass',
}
