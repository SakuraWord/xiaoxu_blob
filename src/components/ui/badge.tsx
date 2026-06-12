interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'cyan' | 'purple' | 'amber' | 'pink' | 'teal' | 'gray'
  size?: 'sm' | 'md'
  className?: string
}

export default function Badge({
  children,
  variant = 'gray',
  size = 'md',
  className = '',
}: BadgeProps) {
  const colorMap = {
    green: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20',
    cyan: 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/20',
    purple: 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20',
    amber: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
    pink: 'bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/20',
    teal: 'bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20',
    gray: 'bg-white/5 text-gray-400 border-white/10',
  }

  const sizeMap = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  return (
    <span
      className={`inline-flex items-center font-mono rounded-full border ${colorMap[variant]} ${sizeMap[size]} ${className}`}
    >
      {children}
    </span>
  )
}
