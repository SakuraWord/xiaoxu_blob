'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

interface ProgressBarProps {
  level: number
  color?: string
  showValue?: boolean
  className?: string
}

export default function ProgressBar({
  level,
  color = '#00ff88',
  showValue = true,
  className = '',
}: ProgressBarProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [animatedWidth, setAnimatedWidth] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start({ width: `${level}%`, transition: { duration: 1.2, ease: 'easeOut' } })
      setAnimatedWidth(level)
    }
  }, [isInView, level, controls])

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showValue && (
          <span className="text-xs font-mono text-gray-500">{level}%</span>
        )}
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          ref={ref}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: '0%' }}
          animate={controls}
        />
      </div>
    </div>
  )
}
