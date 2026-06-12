---
title: 个人官网设计文档
date: 2026-06-04
status: approved
lastUpdated: 2026-06-12
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

## 项目现状 (2026-06-12)

### 已完成 (约 15-20%)

| 模块 | 状态 | 说明 |
|------|------|------|
| 项目脚手架 | ✅ | Next.js 15 + Tailwind + TypeScript + Framer Motion |
| 全局布局 | ✅ | `layout.tsx` — 暗色主题、元数据、smooth scroll |
| 全局样式 | ✅ | `globals.css` — CSS 变量、发光效果、滚动条样式 |
| TypeScript 类型 | ✅ | `types/index.ts` — 7 个接口定义 |
| 技能数据 | ✅ | `data/skills.json` — 12 项技能，5 个类别 |
| 兴趣数据 | ✅ | `data/interests.json` — 6 项兴趣爱好 |
| 项目数据 | ✅ | `data/projects.json` — 5 个项目 |
| Tailwind 配置 | ✅ | 自定义颜色、字体、动画 keyframes |

### 未完成 (约 80-85%)

| 模块 | 优先级 | 说明 |
|------|--------|------|
| 导航栏 (Navbar) | P0 | 粘性导航 + 毛玻璃效果 + 平滑锚点滚动 |
| Hero 首屏 | P0 | 粒子背景 Canvas 动画 + 打字机自我介绍 |
| 技能展示 | P0 | 按类别分组 + 进度条动画 |
| 兴趣爱好 | P0 | 图标卡片 + hover 微交互 |
| 项目展示 | P0 | 项目卡片网格 + 点击展开详情 |
| 联系方式/页脚 | P1 | 社交链接 + 联系方式 |
| 首页整合 | P0 | `page.tsx` — 整合所有组件 |
| 项目详情页 | P1 | `projects/[slug]/page.tsx` |
| GitHub API 客户端 | P1 | `lib/github.ts` — 拉取仓库列表和统计 |
| Gitee API 客户端 | P1 | `lib/gitee.ts` — 拉取 Gitee 数据 |
| 数据缓存 | P1 | `lib/cache.ts` — 构建时缓存 JSON |
| 仓库列表组件 | P1 | `repos.tsx` — GitHub/Gitee 切换 + 排序 |
| 活跃度组件 | P1 | `activity.tsx` — 热力图 + 统计卡片 + 时间线 |

---

## 数据策略（混合方案）

- 构建时调用 GitHub API + Gitee API 拉取仓库列表和活跃度数据
- 数据缓存到 `data/` 目录的 JSON 文件
- 重新部署时自动刷新数据
- GitHub 贡献图使用 GitHub Readme Stats badge embed
- Gitee 活跃度通过 API 数据卡片展示

### API 集成细节

#### GitHub API

```typescript
// src/lib/github.ts
// 功能：
// 1. getRepos(username: string): Promise<Repo[]> — 获取用户所有仓库
// 2. getStats(username: string): Promise<ActivityStats> — 获取活跃度统计
// 3. getTopRepos(username: string, limit: number): Promise<Repo[]> — 获取 Star 最多的仓库

// 实现要点：
// - 使用 fetch() 原生 API，配合 Next.js 的 cache 配置
// - GitHub API 限制: 60 次/小时 (未认证), 5000 次/小时 (PAT)
// - 构建时使用 dynamic('force-static') + revalidateFromIO
// - 支持环境变量 GITHUB_TOKEN
```

#### Gitee API

```typescript
// src/lib/gitee.ts
// 功能：
// 1. getRepos(username: string): Promise<Repo[]> — 获取 Gitee 仓库列表
// 2. getStats(username: string): Promise<ActivityStats> — 获取活跃度统计

// 实现要点：
// - Gitee API 相对宽松: 5000 次/分钟
// - 不需要 Token 即可公开仓库访问
```

#### 数据缓存

```typescript
// src/lib/cache.ts
// 功能：
// 1. saveCache(key: string, data: any): void — 保存数据到 data/ 目录
// 2. loadCache(key: string): any | null — 从 data/ 目录读取缓存
// 3. clearCache(): void — 清除所有缓存
// 4. isStale(key: string, ttl: number): boolean — 检查缓存是否过期

// 实现要点：
// - 使用 Node.js fs 模块
// - 缓存 TTL: 24 小时
// - 构建时先检查缓存，有则直接读取，无则拉取 API
```

---

## 页面结构

```
Navigation (sticky, glassmorphism)
├── Hero Section (打字机自我介绍 + 粒子背景动画)
├── Skills Section (按类别分组，进度条/徽章)
├── Interests & Hobbies (图标卡片 + hover 微交互)
├── Projects Section (项目卡片 + 详情弹窗/独立页)
├── Repositories (GitHub/Gitee 切换，按语言/星标排序)
├── Activity (贡献热力图 + 统计卡片 + 动态时间线)
└── Footer/Contact (社交链接 + 联系方式)
```

### 各组件详细说明

#### 1. Navbar (`components/navbar.tsx`)

- 粘性定位 `sticky top-0`
- 毛玻璃背景 `backdrop-blur-md bg-background/80`
- 品牌 Logo 用等宽字体 + 霓虹绿发光效果
- 导航项: Home / Skills / Projects / Repos / Activity / Contact
- 移动端汉堡菜单 (响应式)
- 滚动时背景加深 + 阴影

#### 2. Hero (`components/hero.tsx`)

- **粒子背景**: Canvas 实现，粒子之间用线连接，形成网络效果
  - 粒子颜色: 霓虹绿 (#00ff88) 和青色 (#00d4ff)
  - 鼠标交互: 粒子跟随鼠标轻微偏移
  - 性能: 使用 requestAnimationFrame + 节流
- **打字机效果**: 逐字显示自我介绍
  - 文案: "Hi, I'm Xiaoxuliang → Full Stack Developer"
  - 光标闪烁动画
  - 循环播放 2-3 条介绍语
- **CTA 按钮**: "View My Work" + "Contact Me"
- 使用 Framer Motion 做入场动画

#### 3. Skills (`components/skills.tsx`)

- 按类别分组: 语言 / 前端 / 后端 / 数据库 / DevOps
- 每个技能显示:
  - 名称 + 图标
  - 进度条 (动画填充到对应 level 值)
  - 星级或数值显示
- 滚动时进度条动画触发 (Intersection Observer + Framer Motion)
- 响应式: 桌面端双列，移动端单列

#### 4. Interests (`components/interests.tsx`)

- 6 张卡片横向排列 (桌面端)，2-3 列网格 (平板/移动端)
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
  - Star/Fork 数据 (从 JSON 或 API)
  - 状态标签 (Active / Developing / Archived)
  - 外链图标 (GitHub / Demo)
- 点击卡片 → 弹出详情模态框 (或跳转到独立页)

#### 6. Repositories (`components/repos.tsx`)

- **平台切换**: GitHub / Gitee 两个 Tab
- **排序选项**: 按 Star / 按 Fork / 按更新时间
- **语言过滤**: 可点击的语言标签
- 仓库列表卡片:
  - 语言标签 (彩色圆点)
  - 仓库名 + 描述
  - Star / Fork / Issues 数量
  - 最后更新时间
  - 外链图标
- 无数据时显示骨架屏

#### 7. Activity (`components/activity.tsx`)

- **统计卡片行**: 总提交数 / 总 PR / 总仓库 / 总 Star
- **GitHub 贡献热力图**:
  - 使用 embed: `https://github-readme-stats.vercel.app/api?username=SakuraWord&show_icons=true&theme=dark`
  - 懒加载
- **月度提交趋势图**: 使用 CSS 柱状图 (轻量方案) 或简单的 SVG 折线图
- **语言分布**: 饼图或环形图
- **动态时间线**: 最近提交/PR 的事件流

#### 8. Footer (`components/footer.tsx`)

- 品牌 Logo + 简短描述
- 社交链接: GitHub / Gitee / LinkedIn / Twitter / Email
- 版权信息
- 使用 ContactLink 类型数据

#### 9. 项目详情页 (`app/projects/[slug]/page.tsx`)

- 根据 slug 从 projects.json 加载项目数据
- 展示:
  - 项目标题 + 状态标签
  - 长描述
  - 技术栈 (大号标签)
  - Star / Fork 数据
  - GitHub / Demo 链接
  - 图片展示 (如果有)

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
│   ├── page.tsx            # 首页 ⬜
│   ├── projects/
│   │   └── [slug]/page.tsx # 项目详情 ⬜
│   └── globals.css         # 全局样式 ✅
├── components/
│   ├── ui/                 # 基础 UI 组件 ⬜
│   │   ├── badge.tsx       # 徽章组件 ⬜
│   │   ├── progress-bar.tsx # 进度条组件 ⬜
│   │   └── card.tsx        # 卡片组件 ⬜
│   ├── navbar.tsx          # 导航栏 ⬜
│   ├── hero.tsx            # 首屏 ⬜
│   ├── skills.tsx          # 技能展示 ⬜
│   ├── interests.tsx       # 兴趣/爱好 ⬜
│   ├── projects.tsx        # 项目卡片 ⬜
│   ├── repos.tsx           # 仓库列表 ⬜
│   ├── activity.tsx        # 活跃度 ⬜
│   └── footer.tsx          # 联系方式 ⬜
├── lib/
│   ├── github.ts           # GitHub API ⬜
│   ├── gitee.ts            # Gitee API ⬜
│   └── cache.ts            # 数据缓存 ⬜
├── data/
│   ├── skills.json         # ✅
│   ├── interests.json      # ✅
│   └── projects.json       # ✅
└── types/
    └── index.ts            # ✅
```

---

## 实施计划

### Phase 1: 基础设施 (已完成)
- [x] Next.js 15 项目初始化
- [x] Tailwind CSS 配置
- [x] TypeScript 类型定义
- [x] 静态数据 JSON 文件
- [x] 全局布局与样式

### Phase 2: UI 基础组件
- [ ] `ui/badge.tsx` — 彩色徽章组件
- [ ] `ui/progress-bar.tsx` — 带动画的进度条
- [ ] `ui/card.tsx` — 通用发光卡片

### Phase 3: 页面组件
- [ ] `navbar.tsx` — 粘性导航
- [ ] `hero.tsx` — 粒子背景 + 打字机
- [ ] `skills.tsx` — 技能展示
- [ ] `interests.tsx` — 兴趣卡片
- [ ] `projects.tsx` — 项目卡片
- [ ] `repos.tsx` — 仓库列表
- [ ] `activity.tsx` — 活跃度展示
- [ ] `footer.tsx` — 联系方式

### Phase 4: 数据集成
- [ ] `github.ts` — GitHub API 客户端
- [ ] `gitee.ts` — Gitee API 客户端
- [ ] `cache.ts` — 构建时缓存逻辑
- [ ] 在 `repos.tsx` 和 `activity.tsx` 中集成 API 数据

### Phase 5: 页面整合
- [ ] `page.tsx` — 整合所有组件
- [ ] `projects/[slug]/page.tsx` — 项目详情页

### Phase 6: 优化
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
