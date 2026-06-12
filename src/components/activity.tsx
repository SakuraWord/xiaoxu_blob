'use client'

import { motion } from 'framer-motion'
import Card from '@/components/ui/card'

// 模拟数据（API 集成后替换）
const mockStats = {
  totalCommits: 1247,
  totalPrs: 42,
  totalIssues: 18,
  totalRepos: 12,
  totalStars: 185,
  totalForks: 38,
  monthlyCommits: [
    { month: 'Jan', count: 85 },
    { month: 'Feb', count: 120 },
    { month: 'Mar', count: 95 },
    { month: 'Apr', count: 150 },
    { month: 'May', count: 180 },
    { month: 'Jun', count: 142 },
  ],
}

const statsCards = [
  { label: 'Total Commits', value: mockStats.totalCommits, icon: '⚡', color: '#00ff88' },
  { label: 'Total PRs', value: mockStats.totalPrs, icon: '🔀', color: '#00d4ff' },
  { label: 'Total Repos', value: mockStats.totalRepos, icon: '📦', color: '#a78bfa' },
  { label: 'Total Stars', value: mockStats.totalStars, icon: '⭐', color: '#f59e0b' },
]

const activityTimeline = [
  { action: 'Pushed to main', repo: 'api-gateway', time: '2 hours ago', color: '#00ff88' },
  { action: 'Opened PR #12', repo: 'cli-toolkit', time: '1 day ago', color: '#00d4ff' },
  { action: 'Released v2.1.0', repo: 'portfolio-site', time: '3 days ago', color: '#a78bfa' },
  { action: 'Merged PR #8', repo: 'note-system', time: '1 week ago', color: '#00ff88' },
  { action: 'Created new repo', repo: 'blog-starter', time: '2 weeks ago', color: '#f59e0b' },
]

export default function Activity() {
  const maxCommits = Math.max(...mockStats.monthlyCommits.map((m) => m.count))

  return (
    <section id="activity" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-[#00ff88]">{'// '}</span>Activity
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            开发者活跃度与贡献趋势
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statsCards.map((stat, i) => (
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
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-1">
                    {stat.label}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
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
                src="https://github-readme-stats.vercel.app/api?username=SakuraWord&show_icons=true&theme=dark&hide_border=true&bg_color=0a0a0a00"
                alt="GitHub contributions"
                className="w-full rounded"
                loading="lazy"
              />
            </div>
          </Card>
        </motion.div>

        {/* 月度提交趋势 */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <h3 className="font-mono text-sm text-gray-400 mb-4">Monthly Commits</h3>
              <div className="flex items-end gap-2 h-40">
                {mockStats.monthlyCommits.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500 font-mono">{month.count}</span>
                    <div
                      className="w-full bg-[#00ff88]/20 rounded-t transition-all duration-1000 relative group"
                      style={{
                        height: `${(month.count / maxCommits) * 100}%`,
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <h3 className="font-mono text-sm text-gray-400 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activityTimeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-200">
                        <span className="font-mono">{item.action}</span>
                        {' '}
                        <span className="text-[#00d4ff] font-mono text-xs">{item.repo}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
