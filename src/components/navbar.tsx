'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#repos', label: 'Repos' },
  { href: '#activity', label: 'Activity' },
  { href: '#contact', label: 'Contact' },
]

function MobileNavLink({
  href,
  label,
  active,
  onClick,
  delay,
}: {
  href: string
  label: string
  active: boolean
  onClick: () => void
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        onClick={onClick}
        className={`
          block px-4 py-3 rounded-lg text-sm font-mono transition-colors
          ${
            active
              ? 'text-[#00ff88] bg-[#00ff88]/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }
        `}
      >
        {label}
      </Link>
    </motion.div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // 确定当前可见的 section
      const sections = navItems.map((item) => item.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled
            ? 'bg-[#0a0a0a]/80 backdrop-blur-md shadow-lg shadow-black/20'
            : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="#home" className="font-mono text-lg font-bold text-[#00ff88] glow-text-green">
            {'<Xiaoxuliang />'}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 rounded-lg text-sm font-mono transition-colors duration-200
                  ${
                    activeSection === item.href.slice(1)
                      ? 'text-[#00ff88] bg-[#00ff88]/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-gray-400 hover:text-white"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${
                mobileOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-opacity duration-300 ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${
                mobileOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/5"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={activeSection === item.href.slice(1)}
                  onClick={() => setMobileOpen(false)}
                  delay={i * 0.05}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
