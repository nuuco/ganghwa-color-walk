const MAX_BYTES = 8 * 1024 * 1024

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; message: string }

export function validateImageFile(file: File): ImageValidationResult {
  if (!file.type.startsWith('image/')) {
    return { ok: false, message: '이미지 파일만 선택할 수 있습니다.' }
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: '8MB 이하의 이미지만 업로드할 수 있습니다.' }
  }
  return { ok: true }
}
