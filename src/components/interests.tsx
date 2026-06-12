'use client'

import { motion } from 'framer-motion'
import interestsData from '@/data/interests.json'
import type { Interest } from '@/types'
import Card from '@/components/ui/card'

export default function Interests() {
  return (
    <section className="py-24 px-4 bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-[#00d4ff]">{'// '}</span>Interests & Hobbies
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            代码之外，热爱探索世界的各种可能
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {interestsData.map((interest: Interest, i: number) => (
            <motion.div
              key={interest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Card glowColor="cyan">
                <div className="text-center">
                  <div
                    className="text-4xl mb-3 inline-block transition-transform duration-300 hover:scale-125"
                    style={{ filter: `drop-shadow(0 0 8px ${interest.color}40)` }}
                  >
                    {interest.icon}
                  </div>
                  <h3 className="font-mono text-lg font-semibold text-white mb-2">
                    {interest.name}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
