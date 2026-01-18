# Requirements Document

## Introduction

PackGenius AI 是一款智能包装工程师助手应用，帮助用户计算最优包装方案并通过 AI 提供专业建议。本次重构旨在：
1. 重组项目架构，提升可维护性
2. 引入现代状态管理方案
3. 升级 UI 组件库至 shadcn/ui
4. 优化开发体验和代码质量

## Glossary

- **PackGenius**: 本应用的名称，智能包装计算系统
- **shadcn/ui**: 基于 Radix UI 和 Tailwind CSS 的可复制组件库
- **Zustand**: 轻量级 React 状态管理库
- **PostgreSQL**: 功能强大的开源关系型数据库
- **Hono**: 轻量级 TypeScript 后端框架
- **Inner Pack**: 内盒，产品的最小包装单元
- **Master Carton**: 外箱，包含多个内盒的运输箱
- **Payload**: 内装物，外箱内所有内盒的总体积

## Requirements

### Requirement 1: 项目目录重构

**User Story:** As a 开发者, I want 清晰的目录结构, so that 代码易于维护和扩展。

#### Acceptance Criteria

1. WHEN 项目初始化完成 THEN PackGenius SHALL 将前端源码放入 `frontend/` 目录，后端源码放入 `backend/` 目录
2. WHEN 开发者查看项目结构 THEN PackGenius SHALL 按功能模块划分子目录（components, hooks, stores, lib, i18n）
3. WHEN 开发者导入模块 THEN PackGenius SHALL 支持 `@/` 路径别名指向 `frontend/src/` 目录
4. WHEN 组件目录存在多个文件 THEN PackGenius SHALL 通过 `index.ts` 提供统一导出

### Requirement 2: 状态管理重构

**User Story:** As a 开发者, I want 集中式状态管理, so that 状态逻辑与 UI 组件解耦。

#### Acceptance Criteria

1. WHEN 应用需要管理全局状态 THEN PackGenius SHALL 使用 Zustand 创建状态 store
2. WHEN 用户输入产品尺寸 THEN PackGenius SHALL 通过 store action 更新状态
3. WHEN 用户修改包装配置 THEN PackGenius SHALL 通过 store action 更新状态
4. WHEN 计算结果生成 THEN PackGenius SHALL 将结果存储在 store 中供组件订阅
5. WHEN AI 分析完成 THEN PackGenius SHALL 将分析结果存储在 store 中

### Requirement 3: UI 组件库升级

**User Story:** As a 用户, I want 美观一致的界面, so that 使用体验更加专业。

#### Acceptance Criteria

1. WHEN 项目构建 THEN PackGenius SHALL 集成 shadcn/ui 组件库
2. WHEN 渲染表单输入 THEN PackGenius SHALL 使用 shadcn/ui 的 Input 组件
3. WHEN 渲染按钮 THEN PackGenius SHALL 使用 shadcn/ui 的 Button 组件
4. WHEN 渲染卡片容器 THEN PackGenius SHALL 使用 shadcn/ui 的 Card 组件
5. WHEN 渲染弹窗 THEN PackGenius SHALL 使用 shadcn/ui 的 Dialog 组件
6. WHEN 渲染提示信息 THEN PackGenius SHALL 使用 shadcn/ui 的 Tooltip 组件
7. WHEN 用户切换语言 THEN PackGenius SHALL 界面文本即时切换且布局保持稳定

### Requirement 4: 国际化重构

**User Story:** As a 用户, I want 多语言支持, so that 可以使用熟悉的语言操作系统。

#### Acceptance Criteria

1. WHEN 项目加载翻译资源 THEN PackGenius SHALL 从独立 JSON 文件读取翻译内容
2. WHEN 组件需要显示文本 THEN PackGenius SHALL 通过 `useTranslation` hook 获取翻译
3. WHEN 用户切换语言 THEN PackGenius SHALL 立即更新所有界面文本
4. WHEN 添加新语言 THEN PackGenius SHALL 仅需添加对应语言的 JSON 文件

### Requirement 5: 自定义 Hooks 提取

**User Story:** As a 开发者, I want 可复用的业务逻辑, so that 代码不重复且易于测试。

#### Acceptance Criteria

1. WHEN 组件需要包装计算逻辑 THEN PackGenius SHALL 通过 `usePackaging` hook 提供
2. WHEN 组件需要 AI 分析功能 THEN PackGenius SHALL 通过 `useAI` hook 提供
3. WHEN 组件需要库存管理功能 THEN PackGenius SHALL 通过 `useInventory` hook 提供
4. WHEN hook 执行异步操作 THEN PackGenius SHALL 提供 loading 和 error 状态

### Requirement 6: 代码质量工具

**User Story:** As a 开发者, I want 统一的代码规范, so that 团队协作更高效。

#### Acceptance Criteria

1. WHEN 代码提交前 THEN PackGenius SHALL 通过 ESLint 检查代码规范
2. WHEN 代码保存时 THEN PackGenius SHALL 通过 Prettier 自动格式化
3. WHEN TypeScript 编译 THEN PackGenius SHALL 启用严格模式检查
4. WHEN 存在类型错误 THEN PackGenius SHALL 阻止构建并提示错误位置

### Requirement 7: 后端 API 与数据持久化

**User Story:** As a 用户, I want 库存数据持久保存, so that 刷新页面后数据不会丢失。

#### Acceptance Criteria

1. WHEN 后端服务启动 THEN PackGenius SHALL 连接 PostgreSQL 数据库并监听 HTTP 请求
2. WHEN 前端请求 GET /api/inventory THEN PackGenius SHALL 返回所有库存纸箱
3. WHEN 前端请求 POST /api/inventory THEN PackGenius SHALL 将纸箱数据存入数据库
4. WHEN 前端请求 DELETE /api/inventory/:id THEN PackGenius SHALL 删除对应纸箱
5. WHEN 前端请求 POST /api/calculate THEN PackGenius SHALL 执行计算并返回结果及 AI 分析

### Requirement 8: 核心功能保持

**User Story:** As a 用户, I want 重构后功能不变, so that 可以继续正常使用系统。

#### Acceptance Criteria

1. WHEN 用户输入产品尺寸并点击计算 THEN PackGenius SHALL 返回最优包装方案
2. WHEN 库存中存在合适纸箱 THEN PackGenius SHALL 推荐库存纸箱
3. WHEN 库存中无合适纸箱 THEN PackGenius SHALL 生成定制纸箱建议
4. WHEN 计算完成 THEN PackGenius SHALL 调用 AI 进行专业分析
5. WHEN 用户编辑库存 THEN PackGenius SHALL 通过 API 保存到数据库
6. WHEN 用户查看 3D 可视化 THEN PackGenius SHALL 渲染可交互的包装示意图
