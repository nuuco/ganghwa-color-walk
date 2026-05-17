/** 시트 제목·컬러명 공통 최대 길이 */
export const SHEET_TEXT_MAX_LENGTH = 20

/** 산책 노트(noteReflection) 최대 길이 */
export const WALK_MEMO_MAX_LENGTH = 200

export function clampWalkMemo(text: string): string {
  return text.slice(0, WALK_MEMO_MAX_LENGTH)
}

export function isValidSheetTitle(title: string): boolean {
  const trimmed = title.trim()
  return trimmed.length >= 1 && trimmed.length <= SHEET_TEXT_MAX_LENGTH
}

export function isValidThemeLabel(label: string): boolean {
  const trimmed = label.trim()
  return trimmed.length >= 1 && trimmed.length <= SHEET_TEXT_MAX_LENGTH
}
