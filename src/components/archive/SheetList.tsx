import type { ArchiveViewMode } from '../../hooks/useArchiveViewMode'
import type { ColorWalkSheet } from '../../types/sheet'
import { SheetCard } from './SheetCard'

interface SheetListProps {
  sheets: ColorWalkSheet[]
  viewMode: ArchiveViewMode
  onOpenSheet: (sheet: ColorWalkSheet) => void
  onEditSheet: (sheet: ColorWalkSheet) => void
  onDeleteSheet: (sheetId: string) => void
}

export function SheetList({
  sheets,
  viewMode,
  onOpenSheet,
  onEditSheet,
  onDeleteSheet,
}: SheetListProps) {
  const sorted = [...sheets].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return (
    <ul className="flex flex-col gap-4 px-page pb-28">
      {sorted.map((sheet) => (
        <li key={sheet.id}>
          <SheetCard
            sheet={sheet}
            viewMode={viewMode}
            onOpen={() => onOpenSheet(sheet)}
            onEdit={() => onEditSheet(sheet)}
            onDelete={() => onDeleteSheet(sheet.id)}
          />
        </li>
      ))}
    </ul>
  )
}
