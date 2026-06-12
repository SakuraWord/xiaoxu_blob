'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import skillsData from '@/data/skills.json'
import type { Skill } from '@/types'
import ProgressBar from '@/components/ui/progress-bar'
import Badge from '@/components/ui/badge'
import Card from '@/components/ui/card'

const categoryColors: Record<string, string> = {
  '语言': '#00ff88',
  '前端': '#00d4ff',
  '后端': '#a78bfa',
  '数据库': '#f59e0b',
  'DevOps': '#ec4899',
}

export default function Skills() {
  const grouped = useMemo(() => {
    const map: Record<string, Skill[]> = {}
    for (const skill of skillsData) {
      if (!map[skill.category]) map[skill.category] = []
      map[skill.category].push(skill)
    }
    return map
  }, [])

  const categories = Object.keys(grouped)

  return (
    <section id="skills" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-[#00ff88]">{'// '}</span>Skills & Expertise
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            持续学习的开发者，技术栈覆盖前后端全链路
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1, duration: 0.5 }}
            >
              <Card className="h-full">
                <div className="flex items-center gap-2 mb-5">
                  <Badge
                    variant={
                      category === '语言' ? 'green' :
                      category === '前端' ? 'cyan' :
                      category === '后端' ? 'purple' :
                      category === '数据库' ? 'amber' : 'pink'
                    }
                    size="sm"
                  >
                    {category}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {grouped[category].map((skill) => (
                    <div key={skill.name} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-mono text-gray-200">{skill.icon}</span>
                          <span className="text-sm text-gray-300">{skill.name}</span>
                        </div>
                        <ProgressBar
                          level={skill.level}
                          color={categoryColors[category] || '#00ff88'}
                          showValue={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
