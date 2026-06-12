import fs from 'fs'
import path from 'path'

const CACHE_DIR = path.join(process.cwd(), 'data')

interface CacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * 确保缓存目录存在
 */
function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
}

/**
 * 保存数据到缓存文件
 */
export function saveCache<T>(key: string, data: T): void {
  try {
    ensureCacheDir()
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    const filePath = path.join(CACHE_DIR, `${key}.json`)
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2))
  } catch (error) {
    console.error(`Failed to save cache for key "${key}":`, error)
  }
}

/**
 * 从缓存文件读取数据
 */
export function loadCache<T>(key: string): T | null {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`)
    if (!fs.existsSync(filePath)) return null

    const content = fs.readFileSync(filePath, 'utf-8')
    const entry: CacheEntry<T> = JSON.parse(content)
    return entry.data
  } catch (error) {
    console.error(`Failed to load cache for key "${key}":`, error)
    return null
  }
}

/**
 * 检查缓存是否过期
 */
export function isStale(key: string, ttlMs: number = 24 * 60 * 60 * 1000): boolean {
  const filePath = path.join(CACHE_DIR, `${key}.json`)
  if (!fs.existsSync(filePath)) return true

  try {
    const stats = fs.statSync(filePath)
    const age = Date.now() - stats.mtimeMs
    return age > ttlMs
  } catch {
    return true
  }
}

/**
 * 清除指定缓存
 */
export function clearCache(key?: string): void {
  try {
    ensureCacheDir()
    if (key) {
      const filePath = path.join(CACHE_DIR, `${key}.json`)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } else {
      // 清除所有缓存
      const files = fs.readdirSync(CACHE_DIR)
      for (const file of files) {
        if (file.endsWith('.json')) {
          fs.unlinkSync(path.join(CACHE_DIR, file))
        }
      }
    }
  } catch (error) {
    console.error('Failed to clear cache:', error)
  }
}

/**
 * 获取缓存文件列表
 */
export function listCache(): string[] {
  try {
    ensureCacheDir()
    return fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith('.json'))
  } catch {
    return []
  }
}
