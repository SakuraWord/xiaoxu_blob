---
title: 个人官网设计文档
date: 2026-06-04
status: approved
lastUpdated: 2026-06-12
version: v2.0 (API 集成完成)
---

# 个人官网设计文档

## 概述

为开发者 Xiaoxuliang 构建一个求职导向的极客风格个人官网，聚合 GitHub 和 Gitee 仓库数据与活跃度展示。

## 目的

- 求职展示为主：向招聘方展示技术能力、项目经历和个人品牌
- 开发者数据门户：聚合 GitHub/Gitee 仓库与活跃度

## 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **语言**: TypeScript
- **部署**: Vercel
- **包管理**: pnpm

## 数据源

- **GitHub**: `SakuraWord` (https://github.com/SakuraWord)
- **Gitee**: `yingnuo` (https://gitee.com/yingnuo)
- **GitHub Readme Stats**: https://github-readme-stats.vercel.app/api

## 项目现状 (2026-06-12 v2.0)

### 已完成

| 模块 | 状态 | 说明 |
|------|------|------|
| 项目脚手架 | ✅ | Next.js 15 + Tailwind + TypeScript + Framer Motion |
| 全局布局 | ✅ | `layout.tsx` — 暗色主题、元数据、smooth scroll |
| 全局样式 | ✅ | `globals.css` — CSS 变量、发光效果、滚动条样式 |
| TypeScript 类型 | ✅ | `types/index.ts` — 8 个接口定义 |
| 技能数据 | ✅ | `data/skills.json` — 12 项技能，5 个类别 |
| 兴趣数据 | ✅ | `data/interests.json` — 6 项兴趣爱好 |
| 项目数据 | ✅ | `data/projects.json` — 5 个项目 |
| Tailwind 配置 | ✅ | 自定义颜色、字体、动画 keyframes |
| 导航栏 (Navbar) | ✅ | 粘性导航 + 毛玻璃效果 + 移动端汉堡菜单 |
| Hero 首屏 | ✅ | Canvas 粒子背景 + 打字机自我介绍 |
| 技能展示 (Skills) | ✅ | 按类别分组 + 进度条动画 |
| 兴趣爱好 (Interests) | ✅ | 图标卡片 + hover 微交互 |
| 项目展示 (Projects) | ✅ | 项目卡片网格 + hover 展开详情 |
| 联系方式/页脚 (Footer) | ✅ | 社交链接 + 联系方式 |
| 首页整合 (page.tsx) | ✅ | 整合所有组件 |
| 项目详情页 | ✅ | `projects/[slug]/page.tsx` |
| UI 基础组件 | ✅ | Badge, ProgressBar, Card |
| GitHub API 客户端 | ✅ | `lib/github.ts` — 拉取仓库、活跃度、commit 数据 |
| Gitee API 客户端 | ✅ | `lib/gitee.ts` — 拉取仓库、活跃度、commit 数据 |
| 数据缓存 | ✅ | `lib/cache.ts` — 构建时缓存 JSON |
| API 路由 — 仓库 | ✅ | `/api/repos` — 根据 platform/user 返回仓库列表 |
| API 路由 — 活跃度 | ✅ | `/api/activity` — 返回活跃度统计数据 |
| 仓库列表 (Repos) | ✅ | GitHub/Gitee 切换 + 排序 + 语言过滤 + 真实数据 |
| 活跃度展示 (Activity) | ✅ | 合并 GitHub + Gitee 活跃度数据展示 |

### 待优化

| 模块 | 优先级 | 说明 |
|------|--------|------|
| 响应式微调 | P2 | 针对部分组件做更细致的断点优化 |
| SEO 增强 | P2 | 结构化数据 (JSON-LD)、Open Graph 标签 |
| 缓存策略优化 | P3 | API 路由层面添加 SWR 缓存 |
| 动画优化 | P3 | prefers-reduced-motion 支持 |
| Gitee 登录恢复 | P3 | Gitee 仓库 API 数据全面对接 |

---

## 数据策略（混合方案）

### 架构变更 (v2.0)

原始方案为"构建时拉取 API → 缓存 JSON 到 data/"，实际落地时改为 **运行时 API 路由 + 客户端动态拉取**：

- 页面组件通过 `fetch('/api/...')` 客户端调用拉取实时数据
- 数据缓存由 Next.js App Router 内置的 `revalidate: 3600`（1 小时）控制
- 用户每次访问页面时自动获取最新数据

### 数据流

```
用户浏览器
  ↓ fetch('/api/repos?platform=github&user=SakuraWord')
/api/repos/route.ts
  ↓ 调用 lib/github.ts getRepos()
GitHub API (https://api.github.com)
  ↓ 1 小时缓存
返回 JSON → 组件渲染
```

### GitHub API

```typescript
// src/lib/github.ts
// 功能：
// 1. getRepos(username: string): Promise<Repo[]> — 获取用户所有公开仓库
// 2. getActivityStats(username: string): Promise<ActivityStats> — 获取活跃度统计
// 3. getTopRepos(username: string, limit: number): Promise<Repo[]> — 获取 Star 最多的仓库

// 实现要点：
// - 使用 fetch() 原生 API，配合 Next.js 的 next.revalidate 配置 (1 小时)
// - GitHub API 限制: 60 次/小时 (未认证), 5000 次/小时 (PAT)
// - 支持环境变量 GITHUB_TOKEN
// - 每个仓库获取最近 5 条 commit 数据用于统计估算
// - 按月份统计 commit 数，生成月度趋势
// - 收集最近 commit 事件用于时间线展示
```

### Gitee API

```typescript
// src/lib/gitee.ts
// 功能：
// 1. getRepos(username: string): Promise<Repo[]> — 获取 Gitee 仓库列表
// 2. getActivityStats(username: string): Promise<ActivityStats> — 获取活跃度统计（含每日 commit 数据）

// 实现要点：
// - Gitee API 相对宽松: 5000 次/分钟
// - 不需要 Token 即可公开仓库访问
// - 每个仓库获取最近 5 条 commit 数据
// - 生成最近 30 天每日提交数据 (dailyCommits)
// - 统计月度 commit 趋势
// - 收集最近 commit 事件用于时间线
```

### API 路由设计

```typescript
// GET /api/repos?platform=github|gitee&user=SakuraWord|yingnuo
// 返回指定平台的仓库列表（真实数据）
// 响应: Repo[]

// GET /api/activity?platform=github|gitee&user=SakuraWord|yingnuo
// 返回指定平台的活跃度统计
// 响应: ActivityStats { totalCommits, totalRepos, totalStars, totalForks,
//   totalIssues, totalPrs, languages, monthlyCommits, dailyCommits?, recentEvents? }
```

### 数据缓存

```typescript
// src/lib/cache.ts (备用方案，当前未使用)
// 功能：
// 1. saveCache(key: string, data: any): void — 保存数据到 data/ 目录
// 2. loadCache(key: string): any | null — 从 data/ 目录读取缓存
// 3. clearCache(): void — 清除所有缓存
// 4. isStale(key: string, ttl: number): boolean — 检查缓存是否过期

// 实现要点：
// - 使用 Node.js fs 模块
// - 缓存 TTL: 24 小时
// - 当前采用 Next.js App Router 内置缓存（next.revalidate: 3600）
```

---

## 页面结构

```
Navigation (sticky, glassmorphism)
├── Hero Section (打字机自我介绍 + 粒子背景动画)
├── Skills Section (按类别分组，进度条/徽章)
├── Interests & Hobbies (图标卡片 + hover 微交互)
├── Projects Section (项目卡片 + 详情弹窗/独立页)
├── Repositories (GitHub/Gitee 切换 + 实时 API 数据)
├── Activity (GitHub + Gitee 合并活跃度展示)
└── Footer/Contact (社交链接 + 联系方式)
```

### 各组件详细说明

#### 1. Navbar (`components/navbar.tsx`)

- 粘性定位 `sticky top-0`
- 毛玻璃背景 `backdrop-blur-md bg-background/80`
- 品牌 Logo 用等宽字体 + 霓虹绿发光效果 `<Xiaoxuliang />`
- 导航项: Home / Skills / Projects / Repos / Activity / Contact
- 移动端汉堡菜单 (响应式)
- 滚动时背景加深 + 阴影
- 当前所在 section 高亮指示

#### 2. Hero (`components/hero.tsx`)

- **粒子背景**: Canvas 实现，粒子之间用线连接，形成网络效果
  - 粒子颜色: 霓虹绿 (#00ff88) 和青色 (#00d4ff)
  - 鼠标交互: 粒子跟随鼠标轻微偏移
  - 性能: 使用 requestAnimationFrame + 节流
- **打字机效果**: 逐字显示自我介绍
  - 文案: "Hi, I'm Xiaoxuliang →" / "Full Stack Developer →" / "Open Source Enthusiast →"
  - 光标闪烁动画
  - 循环播放 3 条介绍语
- **CTA 按钮**: "View My Work" + "Contact Me"
- 使用 Framer Motion 做入场动画
- 滚动指示器动画

#### 3. Skills (`components/skills.tsx`)

- 按类别分组: 语言 / 前端 / 后端 / 数据库 / DevOps
- 每个技能显示:
  - 名称 + 图标
  - 进度条 (动画填充到对应 level 值)
- 滚动时进度条动画触发 (Intersection Observer + Framer Motion)
- 响应式: 桌面端双列，移动端单列
- 每个类别有独立配色

#### 4. Interests (`components/interests.tsx`)

- 6 张卡片排列 (桌面端三列，平板两列，移动端单列)
- 每张卡片:
  - Emoji 图标 (大号)
  - 名称 + 描述
  - 品牌色发光边框
- Hover 效果: 上浮 + 边框发光增强 + 图标缩放
- Framer Motion 交错入场动画 (stagger)

#### 5. Projects (`components/projects.tsx`)

- 项目卡片网格 (3 列 → 2 列 → 1 列)
- 每张卡片:
  - 项目标题 + 描述
  - 技术栈标签 (带颜色)
  - Star/Fork 数据 (从 JSON)
  - 状态标签 (Active / Developing / Archived)
  - 外链图标 (GitHub / Demo)
- Hover 展开详情 (AnimatePresence 动画)
- 点击跳转到项目详情页 `projects/[slug]`

#### 6. Repositories (`components/repos.tsx`) — v2.0 变更

- **平台切换**: GitHub / Gitee 两个 Tab
- **排序选项**: 按 Star / 按更新时间
- **语言过滤**: 可点击的语言标签 (带彩色圆点)
- **数据来源**: 实时调用 `/api/repos` 获取真实仓库数据
- 仓库列表卡片:
  - 语言标签 (彩色圆点，匹配语言颜色)
  - 仓库名 + 描述
  - Star / Fork / Issues 数量
  - 最后更新时间
  - 外链 (直接打开仓库页面)
  - Fork 标记、License 标记
- 加载中/无数据状态
- 支持按语言筛选 + 排序

#### 7. Activity (`components/combined-activity.tsx`) — v2.0 变更

**原始 `activity.tsx` 已被替换为 `combined-activity.tsx`**

核心功能:
1. **Today's Commits** — 当日 Gitee + GitHub 总提交数（精确到当天）
2. **统计卡片行** — 总提交数 / 总 PR / 总仓库 / 总 Star（合并双平台）
3. **双平台对比** — 左右分开展示 GitHub / Gitee 各自的 Commits、Repos、Stars、Issues
4. **GitHub 贡献热力图** — GitHub Readme Stats embed (懒加载)
5. **月度提交趋势图** — CSS 柱状图，合并 GitHub + Gitee 数据
6. **最近活动** — 合并两个平台的最近 commit 事件时间线
7. **语言分布** — 合并使用的语言及仓库数

数据聚合逻辑:
- 客户端通过 `fetch('/api/activity?platform=github&user=SakuraWord')` 获取 GitHub 数据
- 同时 `fetch('/api/activity?platform=gitee&user=yingnuo')` 获取 Gitee 数据
- 前端合并: 月份数据按月份 key 相加，每日数据按日期 key 相加
- 今日提交 = 今日 Gitee 提交 + 今日 GitHub 提交

提交统计方法:
- 每个仓库调用 `GET /repos/:owner/:repo/commits?per_page=5` 获取最近 5 条 commit
- 根据 commit 密度和仓库活跃时间估算总提交数
- GitHub: 最多遍历 20 个非 fork 仓库
- Gitee: 最多遍历 10 个非 fork 仓库

#### 8. Footer (`components/footer.tsx`)

- 品牌 Logo + 简短描述
- 社交链接: GitHub / Gitee / Email / Twitter
- 导航链接
- 版权信息
- 使用 ContactLink 类型数据

#### 9. 项目详情页 (`app/projects/[slug]/page.tsx`)

- Next.js 15 服务端组件 (params 为 Promise)
- 根据 slug 从 projects.json 加载项目数据
- 展示:
  - 项目标题 + 状态标签
  - 长描述
  - 技术栈 (大号标签)
  - Star / Fork 数据
  - GitHub / Demo 链接
- 支持 `generateStaticParams` 预渲染所有项目页

---

## 视觉风格

- 暗色主题为主 (`#0a0a0a` 背景)
- 强调色: 霓虹绿 (`#00ff88`) / 青色 (`#00d4ff`)
- 标题使用等宽字体（JetBrains Mono / Fira Code）
- 首屏 Canvas 粒子/矩阵雨动画
- Framer Motion 入场动画 + hover 发光效果
- 打字机效果展示自我介绍
- 导航栏毛玻璃效果
- 滚动时各组件交错入场动画

---

## 项目结构

```
src/
├── app/
│   ├── layout.tsx          # 全局布局 ✅
│   ├── page.tsx            # 首页 ✅ (整合所有组件)
│   ├── projects/
│   │   ├── layout.tsx      # 项目布局 ✅
│   │   └── [slug]/page.tsx # 项目详情 ✅
│   ├── api/
│   │   ├── activity/
│   │   │   └── route.ts    # 活跃度 API ✅ (合并 GitHub + Gitee)
│   │   └── repos/
│   │       └── route.ts    # 仓库列表 API ✅
│   └── globals.css         # 全局样式 ✅
├── components/
│   ├── ui/                 # 基础 UI 组件 ✅
│   │   ├── badge.tsx       # 徽章组件 ✅
│   │   ├── progress-bar.tsx # 进度条组件 ✅
│   │   └── card.tsx        # 卡片组件 ✅
│   ├── navbar.tsx          # 导航栏 ✅
│   ├── hero.tsx            # 首屏 ✅
│   ├── skills.tsx          # 技能展示 ✅
│   ├── interests.tsx       # 兴趣/爱好 ✅
│   ├── projects.tsx        # 项目卡片 ✅
│   ├── repos.tsx           # 仓库列表 ✅ (实时 API 数据)
│   ├── combined-activity.tsx # 活跃度 ✅ (合并 GitHub + Gitee)
│   └── footer.tsx          # 联系方式 ✅
├── lib/
│   ├── github.ts           # GitHub API ✅ (仓库 + commit 统计)
│   ├── gitee.ts            # Gitee API ✅ (仓库 + commit 统计)
│   └── cache.ts            # 数据缓存 ✅ (备用方案)
├── data/
│   ├── skills.json         # ✅
│   ├── interests.json      # ✅
│   └── projects.json       # ✅
└── types/
    └── index.ts            # ✅ (8 个接口: Skill, Interest, Project,
                             #    Repo, ActivityStats, ActivityEvent, ContactLink)
```

---

## 实施计划

### Phase 1: 基础设施 (已完成 ✅)
- [x] Next.js 15 项目初始化
- [x] Tailwind CSS 配置
- [x] TypeScript 类型定义
- [x] 静态数据 JSON 文件
- [x] 全局布局与样式

### Phase 2: UI 基础组件 (已完成 ✅)
- [x] `ui/badge.tsx` — 彩色徽章组件（7 种变体）
- [x] `ui/progress-bar.tsx` — 带动画的进度条（Intersection Observer 触发）
- [x] `ui/card.tsx` — 通用发光卡片

### Phase 3: 页面组件 (已完成 ✅)
- [x] `navbar.tsx` — 粘性导航 + 移动端汉堡菜单
- [x] `hero.tsx` — 粒子背景 + 打字机
- [x] `skills.tsx` — 技能展示
- [x] `interests.tsx` — 兴趣卡片
- [x] `projects.tsx` — 项目卡片
- [x] `repos.tsx` — 仓库列表 (v2.0 接入实时 API 数据)
- [x] `combined-activity.tsx` — 合并活跃度展示 (v2.0 替代旧 activity.tsx)
- [x] `footer.tsx` — 联系方式

### Phase 4: 数据集成 (已完成 ✅)
- [x] `github.ts` — GitHub API 客户端
- [x] `gitee.ts` — Gitee API 客户端
- [x] `cache.ts` — 数据缓存逻辑 (备用)
- [x] `/api/repos` — 仓库 API 路由
- [x] `/api/activity` — 活跃度 API 路由
- [x] `repos.tsx` 替换为真实 API 数据
- [x] `combined-activity.tsx` 整合双平台活跃度

### Phase 5: 页面整合 (已完成 ✅)
- [x] `page.tsx` — 整合所有组件
- [x] `projects/[slug]/page.tsx` — 项目详情页

### Phase 6: 优化 (待开始 ⬜)
- [ ] 响应式适配 (移动端/平板)
- [ ] 性能优化 (懒加载、代码分割)
- [ ] SEO 优化 (meta、structured data)
- [ ] 动画流畅度优化

---

## 非功能性要求

- 首屏加载 < 2s (Lighthouse performance)
- 移动端响应式适配
- SEO 友好（SSR 渲染）
- 无障碍基础支持
- 动画在 prefers-reduced-motion 下自动禁用
- API 数据缓存 1 小时 (revalidate: 3600)
