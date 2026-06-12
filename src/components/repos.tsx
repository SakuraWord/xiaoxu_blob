'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Repo } from '@/types'
import Card from '@/components/ui/card'
import Badge from '@/components/ui/badge'

const GITHUB_USER = 'SakuraWord'
const GITEE_USER = 'yingnuo'

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  Go: '#00ADD8',
  JavaScript: '#f1e05a',
  Markdown: '#657b83',
  Python: '#3572A5',
  Vue: '#41b883',
  CSS: '#563d7c',
  HTML: '#e34c26',
  NodeJS: '#339933',
  Shell: '#89e051',
  Jupyter: '#DA5B0B',
}

type SortKey = 'stars' | 'updatedAt'

export default function Repos() {
  const [platform, setPlatform] = useState<'github' | 'gitee'>('github')
  const [sortKey, setSortKey] = useState<SortKey>('stars')
  const [languageFilter, setLanguageFilter] = useState<string | null>(null)
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = platform === 'github' ? GITHUB_USER : GITEE_USER
    setLoading(true)

    fetch(`/api/repos?platform=${platform}&user=${user}`)
      .then((res) => res.json())
      .then((data) => {
        setRepos(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error(`Failed to fetch ${platform} repos:`, err)
        setRepos([])
      })
      .finally(() => setLoading(false))
  }, [platform])

  // 收集所有语言
  const allLanguages = useMemo(() => {
    const langs = new Set<string>()
    for (const r of repos) if (r.language) langs.add(r.language)
    return Array.from(langs)
  }, [repos])

  const filtered = useMemo(() => {
    let result = [...repos]
    if (languageFilter) result = result.filter((r) => r.language === languageFilter)
    result.sort((a, b) => {
      if (sortKey === 'stars') return b.stars - a.stars
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    return result
  }, [repos, languageFilter, sortKey])

  const user = platform === 'github' ? GITHUB_USER : GITEE_USER
  const repoUrl = platform === 'github'
    ? `https://github.com/${user}`
    : `https://gitee.com/${user}`

  return (
    <section id="repos" className="py-24 px-4 bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-[#00d4ff]">{'// '}</span>Repositories
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            实时同步 GitHub 与 Gitee 仓库数据
          </p>
        </motion.div>

        {/* 平台切换 */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setPlatform('github')}
              className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
                platform === 'github'
                  ? 'bg-[#00ff88]/15 text-[#00ff88]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              GitHub
            </button>
            <button
              onClick={() => setPlatform('gitee')}
              className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
                platform === 'gitee'
                  ? 'bg-[#00ff88]/15 text-[#00ff88]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Gitee
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono">Sort:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-sm font-mono text-gray-300 outline-none focus:border-[#00ff88]/40"
            >
              <option value="stars">Stars</option>
              <option value="updatedAt">Updated</option>
            </select>
          </div>
        </div>

        {/* 语言过滤 */}
        {allLanguages.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setLanguageFilter(null)}
              className={`text-xs font-mono px-2.5 py-1 rounded-full border transition-all ${
                languageFilter === null
                  ? 'border-[#00ff88]/40 text-[#00ff88]'
                  : 'border-white/10 text-gray-500 hover:text-gray-300'
              }`}
            >
              All
            </button>
            {allLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguageFilter(languageFilter === lang ? null : lang)}
                className={`text-xs font-mono px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all ${
                  languageFilter === lang
                    ? 'border-[#00ff88]/40 text-[#00ff88]'
                    : 'border-white/10 text-gray-500 hover:text-gray-300'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: languageColors[lang] || '#888' }}
                />
                {lang}
              </button>
            ))}
          </div>
        )}

        {/* 仓库列表 */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-mono">
            Loading repositories...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-mono">
            No repositories found.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((repo, i: number) => (
              <motion.div
                key={repo.fullName}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card
                    className="cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                    glowColor="cyan"
                  >
                    <div className="flex items-start gap-3">
                      {/* 语言圆点 */}
                      {repo.language && (
                        <span
                          className="mt-2 w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: languageColors[repo.language] || '#888' }}
                          title={repo.language}
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-mono text-sm font-semibold text-white">
                            {repo.name}
                          </h3>
                          {repo.isFork && <Badge variant="gray" size="sm">Fork</Badge>}
                          {repo.license && <Badge variant="gray" size="sm">{repo.license}</Badge>}
                        </div>

                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                          {repo.description}
                        </p>

                        {/* 标签 */}
                        {repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {repo.topics.slice(0, 4).map((topic) => (
                              <span
                                key={topic}
                                className="text-xs font-mono px-2 py-0.5 bg-[#00d4ff]/10 text-[#00d4ff]/80 rounded-full"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 统计数据 */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-mono">
                          <span className="flex items-center gap-1">
                            <span className="text-[#00ff88]">★</span> {repo.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-[#00d4ff]">↯</span> {repo.forks}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-red-400">●</span> {repo.openIssues}
                          </span>
                          <span className="ml-auto text-gray-600">
                            {new Date(repo.updatedAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
