// ==================== 类型定义 ====================

export interface Skill {
  name: string;
  level: number;       // 0-100
  category: string;
  icon?: string;
}

export interface Interest {
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  stars: number;
  forks: number;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  status: 'active' | 'archived' | 'developing';
}

export interface Repo {
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  forksCount: number;
  openIssues: number;
  updatedAt: string;
  url: string;
  isFork: boolean;
  homepage?: string;
  topics: string[];
  license?: string;
}

export interface ActivityStats {
  totalCommits: number;
  totalPrs: number;
  totalIssues: number;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
  monthlyCommits: Array<{ month: string; count: number }>;
  dailyCommits?: Array<{ date: string; count: number }>;
  recentEvents?: ActivityEvent[];
}

export interface ActivityEvent {
  action: string;
  repo: string;
  message?: string;
  time: string;
  color: string;
  url?: string;
}

export interface ContactLink {
  name: string;
  icon: string;
  url: string;
}
