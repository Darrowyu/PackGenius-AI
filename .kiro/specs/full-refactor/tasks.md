# Implementation Plan

## Phase 1: 项目基础架构

- [x] 1. 初始化 Monorepo 结构





  - [x] 1.1 创建 `frontend/` 和 `backend/` 目录


    - 创建根目录 package.json 配置 npm workspaces
    - 初始化 frontend/package.json 和 backend/package.json
    - _Requirements: 1.1_
  - [x] 1.2 配置前端 Vite 项目


    - 迁移现有前端代码到 frontend/src/
    - 更新 vite.config.ts 配置路径别名 `@/` 指向 `src/`
    - 更新 tsconfig.json
    - _Requirements: 1.2, 1.3_
  - [x] 1.3 配置后端 Hono 项目


    - 创建 backend/src/index.ts 入口文件
    - 配置 TypeScript 和构建脚本
    - _Requirements: 7.1_

## Phase 2: 后端核心功能

- [x] 2. 实现后端 API 服务




  - [x] 2.1 实现 PostgreSQL 数据库连接





    - 创建 backend/src/db.ts
    - 实现连接池和表初始化


    - 实现 CRUD 操作函数
    - _Requirements: 7.1_


  - [x] 2.2 实现包装计算逻辑


    - 迁移 services/packaging.ts 到 backend/src/packaging.ts


    - 保持 findBestBox 核心算法不变


    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 2.3 编写属性测试 - 包装计算正确性


    - **Property 5: 包装计算结果正确性**
    - **Validates: Requirements 5.1, 8.1**
  - [ ] 2.4 编写属性测试 - 库存匹配逻辑
    - **Property 6: 库存匹配逻辑正确性**


    - **Validates: Requirements 8.2**
  - [ ] 2.5 编写属性测试 - 定制纸箱生成
    - **Property 7: 定制纸箱生成逻辑正确性**
    - **Validates: Requirements 8.3**
  - [ ] 2.6 实现 AI 分析服务
    - 迁移 services/ai.ts 到 backend/src/ai.ts
    - 更新 Gemini API 调用
    - _Requirements: 8.4_
  - [ ] 2.7 实现 Hono API 路由
    - GET /api/inventory - 获取库存列表
    - POST /api/inventory - 添加库存
    - DELETE /api/inventory/:id - 删除库存
    - POST /api/calculate - 计算 + AI 分析
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [x] 3. Checkpoint - 后端测试

  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: 前端基础设施

- [x] 4. 配置 shadcn/ui



  - [x] 4.1 初始化 shadcn/ui

    - 运行 shadcn-ui init 配置
    - 创建 components.json
    - 配置 tailwind.config.js
    - _Requirements: 3.1_
  - [x] 4.2 安装核心 UI 组件


    - 添加 Button, Input, Card, Dialog, Tooltip, Label, Sonner
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 5. 实现状态管理



  - [x] 5.1 创建 Zustand Store

    - 创建 frontend/src/stores/packaging-store.ts
    - 实现 product, config, result, aiAnalysis 状态
    - 实现 setProduct, setConfig, calculate 等 actions
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 5.2 编写属性测试 - 状态更新一致性


    - **Property 1: 产品尺寸状态更新一致性**
    - **Property 2: 包装配置状态更新一致性**
    - **Validates: Requirements 2.2, 2.3**

- [x] 6. 实现 API 调用层

  - [x] 6.1 创建 API 封装

    - 创建 frontend/src/lib/api.ts
    - 实现 get, post, delete 方法
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [x] 7. 实现国际化


  - [x] 7.1 拆分翻译文件

    - 创建 frontend/src/i18n/en.json
    - 创建 frontend/src/i18n/zh-CN.json
    - 从现有 i18n.ts 迁移翻译内容
    - _Requirements: 4.1_

  - [x] 7.2 创建 useTranslation hook

    - 创建 frontend/src/hooks/use-translation.ts
    - 实现语言切换功能
    - _Requirements: 4.2, 4.3_
  - [x] 7.3 编写属性测试 - 翻译完整性



    - **Property 4: 翻译 key 映射完整性**
    - **Validates: Requirements 4.2**

## Phase 4: 前端组件迁移

- [x] 8. 迁移业务组件



  - [x] 8.1 迁移 BoxVisualizer 组件

    - 迁移到 frontend/src/components/BoxVisualizer.tsx
    - 使用 shadcn/ui Card 包装
    - _Requirements: 8.6_

  - [x] 8.2 迁移 InventoryEditor 组件

    - 迁移到 frontend/src/components/InventoryEditor.tsx
    - 使用 shadcn/ui Button, Input, Dialog
    - 集成 API 调用
    - _Requirements: 8.5_

  - [x] 8.3 编写属性测试 - CSV 解析

    - **Property 8: CSV 解析正确性**
    - **Validates: Requirements 5.3**
  - [x] 8.4 迁移 LogicGuide 组件

    - 迁移到 frontend/src/components/LogicGuide.tsx
    - 使用 shadcn/ui Dialog
    - _Requirements: 3.5_

  - [ ] 8.5 迁移 ResultDisplay 组件
    - 迁移到 frontend/src/components/ResultDisplay.tsx
    - 使用 shadcn/ui Card, Tooltip
    - _Requirements: 3.4, 3.6_

- [x] 9. 重构 App.tsx


  - [x] 9.1 重构主应用组件


    - 使用 Zustand store 替代 useState
    - 使用 useTranslation hook
    - 集成 shadcn/ui 组件
    - _Requirements: 2.1, 3.7, 8.1_


- [x] 10. Checkpoint - 前端测试

  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: 代码质量与收尾

- [-] 11. 配置代码质量工具


  - [-] 11.1 配置 ESLint

    - 创建 .eslintrc.cjs
    - 配置 TypeScript 规则

    - _Requirements: 6.1_
  - [x] 11.2 配置 Prettier

    - 创建 .prettierrc
    - 配置格式化规则
    - _Requirements: 6.2_
  - [x] 11.3 更新 TypeScript 配置

    - 启用严格模式
    - _Requirements: 6.3, 6.4_

- [x] 12. 更新文档



  - [x] 12.1 更新 README.md

    - 更新项目结构说明
    - 更新启动命令
    - 添加环境变量说明
    - _Requirements: 1.1_


- [x] 13. Final Checkpoint - 全面测试


  - Ensure all tests pass, ask the user if questions arise.
