import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Xiaoxuliang | 全栈开发者',
  description: '全栈开发者 Xiaoxuliang 的个人官网，展示项目经历、技术能力和开发者数据',
  keywords: ['开发者', '全栈', 'Next.js', 'TypeScript', 'GitHub', '开源'],
  authors: [{ name: 'Xiaoxuliang' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="bg-[#0a0a0a] text-gray-200 antialiased selection:bg-[#00ff88]/30 selection:text-[#00ff88]">
        {children}
      </body>
    </html>
  )
}
