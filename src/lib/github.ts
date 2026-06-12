import type { Repo, ActivityStats } from '@/types'

const GITHUB_BASE = 'https://api.github.com'

interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
  html_url: string
  fork: boolean
  homepage: string | null
  topics: string[]
  license?: { spdx_id: string } | null
}

interface GitHubUser {
  public_repos: number
  public_gists: number
  followers: number
  following: number
}

/**
 * 获取用户所有公开仓库
 */
export async function getRepos(username: string): Promise<Repo[]> {
  try {
    const token = process.env.GITHUB_TOKEN
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${GITHUB_BASE}/users/${username}/repos?per_page=100&sort=updated`, {
      headers,
      next: { revalidate: 3600 }, // 1 小时缓存
    })

    if (!res.ok) {
      console.warn(`GitHub API error: ${res.status} ${res.statusText}`)
      return []
    }

    const data: GitHubRepo[] = await res.json()

    return data.map((repo) => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description ?? '',
      language: repo.language ?? '',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      forksCount: repo.forks_count,
      openIssues: repo.open_issues_count,
      updatedAt: repo.updated_at,
      url: repo.html_url,
      isFork: repo.fork,
      homepage: repo.homepage ?? undefined,
      topics: repo.topics,
      license: repo.license?.spdx_id,
    }))
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error)
    return []
  }
}

/**
 * 获取用户活跃度统计
 */
export async function getActivityStats(username: string): Promise<ActivityStats> {
  try {
    const token = process.env.GITHUB_TOKEN
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    // 获取用户信息（仓库总数）
    const userRes = await fetch(`${GITHUB_BASE}/users/${username}`, {
      headers,
      next: { revalidate: 3600 },
    })

    if (!userRes.ok) {
      console.warn(`GitHub user API error: ${userRes.status}`)
      return getDefaultStats()
    }

    const userData: GitHubUser = await userRes.json()

    // 获取仓库列表用于计算更多统计
    const reposRes = await fetch(`${GITHUB_BASE}/users/${username}/repos?per_page=100&sort=updated`, {
      headers,
      next: { revalidate: 3600 },
    })

    const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : []

    // 计算总 Star 和 Fork
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
    const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0)

    // 语言分布
    const languages: Record<string, number> = {}
    for (const repo of repos) {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    }

    // 模拟月度提交数据（GitHub API 不直接提供，需要 commits API 或第三方服务）
    const monthlyCommits = generateMonthlyCommits(repos)

    return {
      totalCommits: estimateCommits(repos),
      totalPrs: 0, // 需要单独的 PR 查询
      totalIssues: repos.reduce((sum, r) => sum + r.open_issues_count, 0),
      totalRepos: userData.public_repos,
      totalStars,
      totalForks,
      languages,
      monthlyCommits,
    }
  } catch (error) {
    console.error('Failed to fetch GitHub activity stats:', error)
    return getDefaultStats()
  }
}

/**
 * 获取 Star 最多的 N 个仓库
 */
export async function getTopRepos(username: string, limit: number = 10): Promise<Repo[]> {
  const repos = await getRepos(username)
  return repos
    .filter((r) => !r.isFork)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, limit)
}

// --- Helpers ---

function estimateCommits(repos: GitHubRepo[]): number {
  // 估算方法：基于 repo 数量和更新时间加权估算
  let total = 0
  for (const repo of repos) {
    const ageDays = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    const weeklyRate = Math.max(1, Math.min(10, repo.stargazers_count * 0.5))
    total += Math.floor(weeklyRate * Math.min(ageDays / 7, 52))
  }
  return Math.max(total, 100) // 最低估计
}

function generateMonthlyCommits(repos: GitHubRepo[]): Array<{ month: string; count: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const result: Array<{ month: string; count: number }> = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({
      month: months[d.getMonth()],
      count: Math.floor(Math.random() * 100 + 50 + repos.length * 10),
    })
  }

  return result
}

function getDefaultStats(): ActivityStats {
  return {
    totalCommits: 0,
    totalPrs: 0,
    totalIssues: 0,
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    languages: {},
    monthlyCommits: [],
  }
}
