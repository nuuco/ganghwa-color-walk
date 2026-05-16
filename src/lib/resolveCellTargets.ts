export interface ResolveCellTargetsInput {
  totalCells: number
  filledIndices: ReadonlySet<number>
  startIndex: number
  fileCount: number
}

/** 탭한 칸부터 시계방향으로 빈 칸 인덱스를 모은 뒤 fileCount만큼 반환 (1장째는 startIndex 고정) */
export function resolveCellTargets({
  totalCells,
  filledIndices,
  startIndex,
  fileCount,
}: ResolveCellTargetsInput): number[] {
  if (fileCount < 1 || totalCells < 1) return []

  const targets: number[] = [startIndex]
  if (fileCount === 1) return targets

  let i = (startIndex + 1) % totalCells
  const startLoop = i

  while (targets.length < fileCount) {
    if (!filledIndices.has(i)) {
      targets.push(i)
    }
    i = (i + 1) % totalCells
    if (i === startLoop) break
  }

  return targets.slice(0, fileCount)
}
