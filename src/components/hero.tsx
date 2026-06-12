'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

const INTRO_TEXTS = [
  'Hi, I\'m Xiaoxuliang →',
  'Full Stack Developer →',
  'Open Source Enthusiast →',
]

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef<number>(0)
  const [typedText, setTypedText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // 打字机效果
  useEffect(() => {
    const current = INTRO_TEXTS[textIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(current.substring(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setTypedText(current.substring(0, charIndex - 1))
        setCharIndex((prev) => prev - 1)
        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % INTRO_TEXTS.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex])

  // 粒子 Canvas 动画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // 初始化粒子
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15))
    const colors = ['#00ff88', '#00d4ff']
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouse)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // 更新粒子位置
      for (const p of particles) {
        // 鼠标交互
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          p.vx -= dx * 0.00005
          p.vy -= dy * 0.00005
        }

        p.x += p.vx
        p.y += p.vy

        // 边界环绕
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      }

      // 绘制连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // 绘制粒子
      for (const p of particles) {
        const colorIdx = Math.floor(Math.random() * colors.length)
        ctx.beginPath()
        ctx.fillStyle = colors[colorIdx]
        ctx.globalAlpha = p.opacity
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 粒子 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/30 to-[#0a0a0a]" />

      {/* 内容 */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-mono text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="text-[#00ff88] glow-text-green">Xiaoxuliang</span>
          </h1>

          <div className="font-mono text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 h-10">
            {typedText}
            <span className="animate-blink text-[#00ff88]">|</span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto"
          >
            热衷于构建优雅的后端系统与极致的用户体验。
            <br className="hidden sm:block" />
            追求代码质量，相信简洁即是力量。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#projects"
              className="px-8 py-3 bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] font-mono rounded-lg hover:bg-[#00ff88]/20 transition-all duration-300 glow-green"
            >
              View My Work ↓
            </a>
            <a
              href="#contact"
              className="px-8 py-3 bg-white/5 border border-white/10 text-gray-300 font-mono rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Contact Me →
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* 滚动指示器 */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 border-2 border-gray-600 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-gray-500 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
