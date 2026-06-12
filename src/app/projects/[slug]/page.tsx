import { notFound } from 'next/navigation'
import projectsData from '@/data/projects.json'
import type { Project } from '@/types'
import Navbar from '@/components/navbar'
import Badge from '@/components/ui/badge'
import Link from 'next/link'

const statusMap = {
  active: { label: 'Active', variant: 'green' as const },
  developing: { label: 'Developing', variant: 'amber' as const },
  archived: { label: 'Archived', variant: 'gray' as const },
}

export function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = (projectsData as Project[]).find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  const status = statusMap[project.status]

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-[#00ff88] transition-colors mb-8"
          >
            <span>←</span> Back to Projects
          </Link>

          {/* 项目头部 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="font-mono text-3xl md:text-4xl font-bold text-white">
                {project.title}
              </h1>
              <Badge variant={status.variant} size="sm">{status.label}</Badge>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* 技术栈 */}
          <div className="mb-10">
            <h2 className="font-mono text-sm text-gray-400 mb-4">
              {'// '}Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-sm font-mono px-3 py-1.5 bg-[#00ff88]/10 text-[#00ff88]/90 border border-[#00ff88]/20 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="text-2xl font-mono font-bold text-[#00ff88]">
                {project.stars}
              </div>
              <div className="text-xs text-gray-500 font-mono mt-1">⭐ Stars</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <div className="text-2xl font-mono font-bold text-[#00d4ff]">
                {project.forks}
              </div>
              <div className="text-xs text-gray-500 font-mono mt-1">↯ Forks</div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] font-mono rounded-lg hover:bg-[#00ff88]/20 transition-all duration-300"
              >
                View on GitHub ↗
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-white/5 border border-white/10 text-gray-300 font-mono rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Live Demo ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
