import { NextResponse } from 'next/server'
import { getRepos } from '@/lib/github'
import { getRepos as getGiteeRepos } from '@/lib/gitee'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform')
  const user = searchParams.get('user')

  if (!platform || !user) {
    return NextResponse.json({ error: 'Missing platform or user' }, { status: 400 })
  }

  try {
    if (platform === 'github') {
      const repos = await getRepos(user)
      return NextResponse.json(repos)
    } else if (platform === 'gitee') {
      const repos = await getGiteeRepos(user)
      return NextResponse.json(repos)
    } else {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }
  } catch (error) {
    console.error(`Repos API error (${platform}/${user}):`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
