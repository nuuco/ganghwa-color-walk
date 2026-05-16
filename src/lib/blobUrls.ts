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

/** 셀 Blob 스왑·이동 시 기존 object URL을 유지해 재로딩 깜박임 방지 */
export function swapObjectUrlKeys(keyA: string, keyB: string): void {
  const urlA = urlByKey.get(keyA)
  const urlB = urlByKey.get(keyB)

  if (urlA !== undefined && urlB !== undefined) {
    urlByKey.set(keyA, urlB)
    urlByKey.set(keyB, urlA)
    return
  }

  if (urlA !== undefined) {
    urlByKey.set(keyB, urlA)
    urlByKey.delete(keyA)
    return
  }

  if (urlB !== undefined) {
    urlByKey.set(keyA, urlB)
    urlByKey.delete(keyB)
  }
}

export function revokeAllObjectUrls(): void {
  for (const url of urlByKey.values()) {
    URL.revokeObjectURL(url)
  }
  urlByKey.clear()
}
