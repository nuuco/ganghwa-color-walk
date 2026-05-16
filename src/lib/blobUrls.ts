const urlByKey = new Map<string, string>()

export function getOrCreateObjectUrl(blob: Blob, key: string): string {
  const existing = urlByKey.get(key)
  if (existing) return existing
  const url = URL.createObjectURL(blob)
  urlByKey.set(key, url)
  return url
}

export function revokeObjectUrl(key: string): void {
  const url = urlByKey.get(key)
  if (!url) return
  URL.revokeObjectURL(url)
  urlByKey.delete(key)
}

export function revokeAllObjectUrls(): void {
  for (const url of urlByKey.values()) {
    URL.revokeObjectURL(url)
  }
  urlByKey.clear()
}
