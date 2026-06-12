interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glowColor?: 'green' | 'cyan'
}

export default function Card({
  children,
  className = '',
  hover = true,
  glowColor = 'green',
}: CardProps) {
  const glowMap = {
    green: 'hover:border-[#00ff88]/30 hover:shadow-[0_0_15px_rgba(0,255,136,0.1)]',
    cyan: 'hover:border-[#00d4ff]/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.1)]',
  }

  return (
    <div
      className={`
        bg-white/[0.02] border border-white/5 rounded-xl p-5
        ${hover ? glowMap[glowColor] + ' transition-all duration-300 cursor-default' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
