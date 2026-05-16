import html2canvas, { type Options as Html2CanvasOptions } from 'html2canvas'

const DEFAULT_CAPTURE_OPTIONS: Partial<Html2CanvasOptions> = {
  scale: 3,
  backgroundColor: '#201f1f',
  useCORS: true,
}

export async function capturePostcardElement(
  el: HTMLElement,
  options?: Partial<Html2CanvasOptions>,
): Promise<HTMLCanvasElement> {
  return html2canvas(el, {
    ...DEFAULT_CAPTURE_OPTIONS,
    ...options,
  })
}

export function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('JPEG 변환에 실패했습니다.'))
      },
      'image/jpeg',
      quality,
    )
  })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export async function shareImageFile(blob: Blob, filename: string): Promise<boolean> {
  if (!navigator.share || !navigator.canShare) return false

  const file = new File([blob], filename, { type: 'image/jpeg' })
  const payload = { files: [file] }
  if (!navigator.canShare(payload)) return false

  try {
    await navigator.share(payload)
    return true
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return false
    throw err
  }
}

export function buildPostcardFilename(sheetTitle: string, dateIso: string): string {
  const safeTitle = sheetTitle
    .trim()
    .replace(/[^\w\u3131-\uD79D-]+/gu, '_')
    .replace(/_+/g, '_')
    .slice(0, 24) || 'color-walk'
  const datePart = dateIso.slice(0, 10)
  return `color-walk_${safeTitle}_${datePart}.jpg`
}
