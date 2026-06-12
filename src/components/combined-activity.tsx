'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import type { ActivityStats, ActivityEvent } from '@/types'

const GITHUB_USER = 'SakuraWord'
const GITEE_USER = 'yingnuo'

interface CombinedStats {
  github: ActivityStats
  gitee: ActivityStats
  combined: ActivityStats
}

// --- 统计卡片定义 ---
const statCardDefs = [
  { label: 'Total Commits', key: 'commits', icon: '⚡', color: '#00ff88' },
  { label: 'Total PRs', key: 'prs', icon: '🔀', color: '#00d4ff' },
  { label: 'Total Repos', key: 'repos', icon: '📦', color: '#a78bfa' },
  { label: 'Total Stars', key: 'stars', icon: '⭐', color: '#f59e0b' },
]

export default function CombinedActivity() {
  const [combined, setCombined] = useState<CombinedStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [ghRes, gtRes] = await Promise.all([
        fetch(`/api/activity?platform=github&user=${GITHUB_USER}`),
        fetch(`/api/activity?platform=gitee&user=${GITEE_USER}`),
      ])

      const ghData = ghRes.ok ? await ghRes.json() : null
      const gtData = gtRes.ok ? await gtRes.json() : null

      if (!ghData && !gtData) {
        setError('Failed to fetch activity data')
        setLoading(false)
        return
      }

      // 合并数据
      const combined: ActivityStats = {
        totalCommits: (ghData?.totalCommits || 0) + (gtData?.totalCommits || 0),
        totalPrs: (ghData?.totalPrs || 0) + (gtData?.totalPrs || 0),
        totalIssues: (ghData?.totalIssues || 0) + (gtData?.totalIssues || 0),
        totalRepos: (ghData?.totalRepos || 0) + (gtData?.totalRepos || 0),
        totalStars: (ghData?.totalStars || 0) + (gtData?.totalStars || 0),
        totalForks: (ghData?.totalForks || 0) + (gtData?.totalForks || 0),
        languages: mergeLanguages(
          ghData?.languages ?? {},
          gtData?.languages ?? {}
        ),
        monthlyCommits: mergeMonthlyCommits(
          ghData?.monthlyCommits ?? [],
          gtData?.monthlyCommits ?? []
        ),
        dailyCommits: mergeDailyCommits(
          ghData?.dailyCommits ?? [],
          gtData?.dailyCommits ?? []
        ),
        recentEvents: [
          ...(gtData?.recentEvents ?? []),
          ...(ghData?.recentEvents ?? []),
        ]
          .sort((a, b) => {
            const parseTime = (t: string) => {
              if (t.includes('hour')) return parseInt(t)
              if (t.includes('day')) return parseInt(t) * 24
              if (t.includes('week')) return parseInt(t) * 168
              if (t.includes('month')) return parseInt(t) * 720
              return 0
            }
            return parseTime(a.time) - parseTime(b.time)
          })
          .slice(0, 10),
      }

      setCombined({
        github: ghData || {
          totalCommits: 0, totalPrs: 0, totalIssues: 0,
          totalRepos: 0, totalStars: 0, totalForks: 0,
          languages: {}, monthlyCommits: [],
        },
        gitee: gtData || {
          totalCommits: 0, totalPrs: 0, totalIssues: 0,
          totalRepos: 0, totalStars: 0, totalForks: 0,
          languages: {}, monthlyCommits: [],
        },
        combined,
      })
    } catch (err) {
      console.error('Failed to fetch activity:', err)
      setError('Failed to fetch activity data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <section id="activity" className="py-24 px-4 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="font-mono text-[#00ff88] animate-pulse">Loading activity data...</div>
        </div>
      </section>
    )
  }

  if (error || !combined) {
    return (
      <section id="activity" className="py-24 px-4 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="text-red-400 font-mono">{error}</div>
        </div>
      </section>
    )
  }

  const { combined: c, github, gitee } = combined
  const maxMonthly = Math.max(...c.monthlyCommits.map((m) => m.count), 1)

  // 今日提交数（最近一天的合并数据）
  const todayKey = new Date().toISOString().slice(0, 10)
  const todayGh = (github.dailyCommits ?? []).find((d) => d.date === todayKey)?.count ?? 0
  const todayGt = (gitee.dailyCommits ?? []).find((d) => d.date === todayKey)?.count ?? 0
  const todayTotal = todayGh + todayGt

  return (
    <section id="activity" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-[#00ff88]">{'// '}</span>Developer Activity
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            实时同步 GitHub 与 Gitee 的提交活跃度
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Badge variant="green" size="sm">GitHub: {GITHUB_USER}</Badge>
            <Badge variant="cyan" size="sm">Gitee: {GITEE_USER}</Badge>
          </div>
        </motion.div>

        {/* 今日活跃卡片 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-mono text-sm text-gray-400 mb-2">Today&apos;s Commits</h3>
                <div className="text-4xl font-mono font-bold text-[#00ff88] glow-text-green">
                  {todayTotal}
                </div>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  Gitee: {todayGt} · GitHub: {todayGh}
                </p>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-gray-300">
                  {new Date().toLocaleDateString('zh-CN', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statCardDefs.map((stat, i) => {
            const value = c[stat.key as keyof ActivityStats] as number
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Card>
                  <div className="text-center">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className="font-mono text-2xl font-bold text-white mt-2">
                      {value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-1">
                      {stat.label}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* 双平台对比 */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {/* GitHub */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-sm text-gray-400">GitHub</h3>
                <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00d4ff] hover:text-[#00ff88] font-mono transition-colors">
                  @{GITHUB_USER} ↗
                </a>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Commits', value: github.totalCommits.toLocaleString() },
                  { label: 'Repos', value: github.totalRepos.toLocaleString() },
                  { label: 'Stars', value: github.totalStars.toLocaleString() },
                  { label: 'Issues', value: github.totalIssues.toLocaleString() },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-mono">{item.label}</span>
                    <span className="text-white font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Gitee */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-sm text-gray-400">Gitee</h3>
                <a href={`https://gitee.com/${GITEE_USER}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00d4ff] hover:text-[#00ff88] font-mono transition-colors">
                  @{GITEE_USER} ↗
                </a>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Commits', value: gitee.totalCommits.toLocaleString() },
                  { label: 'Repos', value: gitee.totalRepos.toLocaleString() },
                  { label: 'Stars', value: gitee.totalStars.toLocaleString() },
                  { label: 'Issues', value: gitee.totalIssues.toLocaleString() },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-mono">{item.label}</span>
                    <span className="text-white font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* GitHub 贡献热力图 (Embed) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <Card>
            <h3 className="font-mono text-sm text-gray-400 mb-4">GitHub Contributions</h3>
            <div className="rounded-lg overflow-hidden bg-white/5 p-4">
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USER}&show_icons=true&theme=dark&hide_border=true`}
                alt="GitHub contributions"
                className="w-full rounded"
                loading="lazy"
              />
            </div>
          </Card>
        </motion.div>

        {/* 月度提交趋势（合并 GitHub + Gitee） */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <h3 className="font-mono text-sm text-gray-400 mb-4">Monthly Commits (GitHub + Gitee)</h3>
              <div className="flex items-end gap-2 h-40">
                {c.monthlyCommits.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500 font-mono">{month.count}</span>
                    <div
                      className="w-full bg-[#00ff88]/20 rounded-t transition-all duration-1000 relative group"
                      style={{
                        height: `${(month.count / maxMonthly) * 100}%`,
                        background: 'linear-gradient(to top, #00ff88, #00d4ff)',
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
                        {month.count} commits
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{month.month}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* 最近活动 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <h3 className="font-mono text-sm text-gray-400 mb-4">Recent Activity</h3>
              {c.recentEvents && c.recentEvents.length > 0 ? (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {c.recentEvents.map((event: ActivityEvent, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-200">
                          <span className="font-mono">{event.action}</span>
                          {' '}
                          <span className="text-[#00d4ff] font-mono text-xs">{event.repo}</span>
                          {event.message && (
                            <span className="text-gray-500 text-xs font-mono block truncate mt-0.5">
                              {event.message}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 font-mono">No recent activity</p>
              )}
            </Card>
          </motion.div>
        </div>

        {/* 语言分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <h3 className="font-mono text-sm text-gray-400 mb-4">Languages Used</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(c.languages)
                .sort((a, b) => b[1] - a[1])
                .map(([lang, count]) => (
                  <span
                    key={lang}
                    className="text-xs font-mono px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300"
                  >
                    {lang} <span className="text-gray-500">×{count}</span>
                  </span>
                ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// --- Helpers ---

function mergeLanguages(gh: Record<string, number>, gt: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = { ...gh }
  for (const [lang, count] of Object.entries(gt)) {
    result[lang] = (result[lang] || 0) + count
  }
  return result
}

function mergeMonthlyCommits(
  gh: Array<{ month: string; count: number }>,
  gt: Array<{ month: string; count: number }>
): Array<{ month: string; count: number }> {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const merged: Record<string, number> = {}
  for (const m of monthNames) merged[m] = 0
  for (const m of gh) if (merged[m.month] !== undefined) merged[m.month] += m.count
  for (const m of gt) if (merged[m.month] !== undefined) merged[m.month] += m.count
  return monthNames
    .filter((m) => merged[m] > 0)
    .map((m) => ({ month: m, count: merged[m] }))
    .sort((a, b) => monthNames.indexOf(b.month) - monthNames.indexOf(a.month))
    .slice(0, 6)
}

function mergeDailyCommits(
  gh: Array<{ date: string; count: number }>,
  gt: Array<{ date: string; count: number }>
): Array<{ date: string; count: number }> {
  const merged: Record<string, number> = {}
  for (const d of gh) merged[d.date] = (merged[d.date] || 0) + d.count
  for (const d of gt) merged[d.date] = (merged[d.date] || 0) + d.count
  return Object.entries(merged)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 30)
    .map(([date, count]) => ({ date, count }))
}
