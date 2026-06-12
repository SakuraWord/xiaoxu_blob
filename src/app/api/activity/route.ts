import { NextResponse } from 'next/server'
import { getActivityStats } from '@/lib/github'
import { getActivityStats as getGiteeStats } from '@/lib/gitee'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform')
  const user = searchParams.get('user')

  if (!platform || !user) {
    return NextResponse.json({ error: 'Missing platform or user' }, { status: 400 })
  }

  try {
    if (platform === 'github') {
      const stats = await getActivityStats(user)
      return NextResponse.json(stats)
    } else if (platform === 'gitee') {
      const stats = await getGiteeStats(user)
      return NextResponse.json(stats)
    } else {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }
  } catch (error) {
    console.error(`Activity API error (${platform}/${user}):`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
