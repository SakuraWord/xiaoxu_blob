'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const contacts = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com/SakuraWord' },
  { name: 'Gitee', icon: 'gitee', url: 'https://gitee.com/yingnuo' },
  { name: 'Email', icon: 'email', url: 'mailto:xiaoxuliang@example.com' },
  { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/SakuraWord' },
]

function SocialIcon({ name, url }: { name: string; url: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    gitee: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-2-8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00ff88] hover:border-[#00ff88]/30 hover:bg-[#00ff88]/5 transition-all duration-300"
      aria-label={name}
    >
      {iconMap[name]}
    </a>
  )
}

export default function Footer() {
  return (
    <footer id="contact" className="py-16 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Brand */}
          <h2 className="font-mono text-2xl font-bold text-[#00ff88] glow-text-green mb-3">
            {'<Xiaoxuliang />'}
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
            全栈开发者，热衷于构建优雅的系统与极致的用户体验。
            <br />
            持续学习，持续创造。
          </p>

          {/* 社交链接 */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {contacts.map((contact) => (
              <SocialIcon key={contact.name} {...contact} />
            ))}
          </div>

          {/* 导航 */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-500 mb-8">
            <Link href="#home" className="hover:text-[#00ff88] transition-colors">Home</Link>
            <span className="text-gray-700">/</span>
            <Link href="#skills" className="hover:text-[#00ff88] transition-colors">Skills</Link>
            <span className="text-gray-700">/</span>
            <Link href="#projects" className="hover:text-[#00ff88] transition-colors">Projects</Link>
            <span className="text-gray-700">/</span>
            <Link href="#repos" className="hover:text-[#00ff88] transition-colors">Repos</Link>
            <span className="text-gray-700">/</span>
            <Link href="#activity" className="hover:text-[#00ff88] transition-colors">Activity</Link>
          </div>

          {/* 版权 */}
          <p className="text-xs text-gray-600 font-mono">
            © {new Date().getFullYear()} Xiaoxuliang. Built with Next.js & Tailwind CSS.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
