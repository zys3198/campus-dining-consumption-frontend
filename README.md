# 校园餐饮消费行为分析与优化系统 — 前端

基于 React + TypeScript + Ant Design 的校园餐饮数据分析前端，提供管理后台、食堂经理看板、学生个人中心等界面。

## 技术栈

- **框架**: React 19 + TypeScript
- **UI 库**: Ant Design 6
- **构建**: Vite 8
- **状态管理**: Zustand
- **数据请求**: Axios + TanStack React Query
- **图表**: ECharts (echarts-for-react)
- **部署**: Docker 多阶段构建 → Nginx

## 项目结构

```
src/
├── api/               # API 客户端与接口定义
│   ├── client.ts      # Axios 实例（baseURL: /api/v1）
│   ├── auth.ts        # 登录 / 用户信息
│   ├── dashboard.ts   # 运营 / 营养 / 实时看板
│   └── ai.ts          # AI 智能查询
├── components/        # 通用组件
├── layouts/           # 布局组件（按角色区分）
├── pages/             # 页面组件
├── stores/            # Zustand 状态管理
├── router/            # React Router 路由配置
└── App.tsx            # 应用入口
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 3000，自动代理 /api → localhost:8000）
npm run dev
```

确保后端服务运行在 `localhost:8000`，Vite 会自动代理 `/api` 请求到后端。

## Docker 构建

前端 Dockerfile 使用多阶段构建：

1. **构建阶段** (`node:20-alpine`) — `npm ci` + `npm run build`
2. **运行阶段** (`nginx:alpine`) — 静态文件 + Nginx 反向代理

Nginx 配置（`nginx.conf`）：
- `/` — 前端静态资源（SPA fallback）
- `/api/` — 反向代理到后端 `app:8000`

```bash
# 单独构建
docker build -t campus-dining-frontend .

# 通过后端 docker-compose 启动（推荐）
cd ../campus-dining-consumption-backend/docker
docker compose up --build -d
```

前端访问地址：`http://localhost`（端口 80）

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 3000） |
| `npm run build` | 生产构建 |
| `npm run lint` | ESLint 检查 |
| `npm run preview` | 预览生产构建 |
| `npm run test` | 单元测试（Vitest） |
| `npm run test:watch` | 单元测试（监听模式） |
| `npm run test:coverage` | 单元测试（覆盖率） |
| `npm run test:e2e` | E2E 测试（Playwright） |
| `npm run test:integration` | 集成测试（Playwright） |

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `VITE_API_BASE_URL` | `/api/v1` | 后端 API 地址（Docker 环境使用相对路径走 Nginx 代理） |
