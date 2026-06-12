'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projectsData from '@/data/projects.json'
import type { Project } from '@/types'
import Card from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import Link from 'next/link'

const statusMap = {
  active: { label: 'Active', variant: 'green' as const },
  developing: { label: 'Developing', variant: 'amber' as const },
  archived: { label: 'Archived', variant: 'gray' as const },
}

export default function Projects() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-[#00ff88]">{'// '}</span>Featured Projects
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            精选项目，展示技术深度与工程能力
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projectsData.map((project, i: number) => {
            const p = project as Project
            return (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              onMouseEnter={() => setHoveredSlug(p.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
            >
              <Link href={`/projects/${p.slug}`}>
                <Card
                  glowColor={i % 2 === 0 ? 'green' : 'cyan'}
                  className="h-full cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* 状态标签 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-gray-500">#{i + 1}</span>
                    {(() => {
                      const s = statusMap[p.status]
                      return <Badge variant={s.variant} size="sm">{s.label}</Badge>
                    })()}
                  </div>

                  {/* 标题 */}
                  <h3 className="font-mono text-lg font-semibold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                    {p.title}
                  </h3>

                  {/* 描述 */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {p.description}
                  </p>

                  {/* 技术栈 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2 py-0.5 bg-white/5 text-gray-400 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* 底部信息 */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="text-[#00ff88]">★</span> {p.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[#00d4ff]">↯</span> {p.forks}
                    </span>
                    {p.githubUrl && (
                      <span className="flex items-center gap-1 ml-auto">
                        <span className="text-gray-400">↗</span> GitHub
                      </span>
                    )}
                  </div>

                  {/* Hover 展开详情 */}
                  <AnimatePresence>
                    {hoveredSlug === p.slug && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-white/5">
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {p.longDescription}
                          </p>
                          <div className="flex gap-3 mt-3">
                            {p.githubUrl && (
                              <a
                                href={p.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono text-[#00d4ff] hover:text-[#00ff88] transition-colors"
                              >
                                GitHub ↗
                              </a>
                            )}
                            {p.demoUrl && (
                              <a
                                href={p.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono text-[#00d4ff] hover:text-[#00ff88] transition-colors"
                              >
                                Demo ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </Link>
            </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
