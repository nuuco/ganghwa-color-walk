import { useEffect, useRef, useState } from 'react'
import { AppBar } from '../components/layout/AppBar'
import { CompleteView } from '../components/complete/CompleteView'
import { PostcardPreview } from '../components/complete/PostcardPreview'
import { SummaryBanner } from '../components/complete/SummaryBanner'
import { ExportActions } from '../components/export/ExportActions'
import { useApp } from '../context/AppContext'
import {
  buildPostcardFilename,
  canvasToJpegBlob,
  capturePostcardElement,
  downloadBlob,
  shareImageFile,
} from '../lib/exportImage'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { isKakaoConfigured, shareKakaoFeed } from '../lib/kakao'

function isoToDateInput(iso?: string): string {
  if (!iso) return new Date().toISOString().slice(0, 10)
  return iso.slice(0, 10)
}

function dateInputToIso(date: string): string {
  return new Date(`${date}T12:00:00`).toISOString()
}

function getAppShareUrl(sheetId: string): string {
  const base = import.meta.env.VITE_APP_URL?.trim().replace(/\/$/, '')
  if (!base) return window.location.href
  const url = new URL(base)
  url.searchParams.set('sheet', sheetId)
  return url.toString()
}

async function capturePostcardBlob(root: HTMLElement): Promise<Blob> {
  const canvas = await capturePostcardElement(root)
  return canvasToJpegBlob(canvas)
}

export function ViewPage() {
  const { getActiveSheet, setStep, updateSheet, setActiveSheetId } = useApp()
  const isOnline = useOnlineStatus()
  const sheet = getActiveSheet()
  const postcardRef = useRef<HTMLElement>(null)
  const [headline, setHeadline] = useState(sheet?.postcardHeadline ?? '')
  const [exporting, setExporting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | undefined>()

  useEffect(() => {
    if (sheet) {
      setHeadline(sheet.postcardHeadline)
    }
  }, [sheet])

  if (!sheet) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <button type="button" onClick={() => setStep('archive')} className="underline">
          목록으로
        </button>
      </div>
    )
  }

  const dateValue = isoToDateInput(sheet.completedAt ?? sheet.updatedAt)
  const exportDateIso = sheet.completedAt ?? sheet.updatedAt
  const kakaoConfigured = isKakaoConfigured()
  const kakaoDisabled = !kakaoConfigured || !isOnline
  const offlineKakaoStatus =
    !isOnline && kakaoConfigured
      ? '카카오 공유는 인터넷 연결 후 이용할 수 있어요.'
      : undefined

  const showStatus = (message: string, ms = 3000) => {
    setStatusMessage(message)
    window.setTimeout(() => {
      setStatusMessage((current) => (current === message ? undefined : current))
    }, ms)
  }

  const getExportRoot = (): HTMLElement | null => postcardRef.current

  const handleSave = async () => {
    const root = getExportRoot()
    if (!root) {
      showStatus('엽서를 찾을 수 없어요.')
      return
    }

    setExporting(true)
    try {
      const blob = await capturePostcardBlob(root)
      const filename = buildPostcardFilename(sheet.sheetTitle, exportDateIso)
      downloadBlob(blob, filename)
      showStatus('사진첩에 저장했어요.')
    } catch {
      showStatus('저장에 실패했어요. 다시 시도해 주세요.')
    } finally {
      setExporting(false)
    }
  }

  const handleKakao = async () => {
    setExporting(true)
    try {
      await shareKakaoFeed({
        title: sheet.sheetTitle,
        description: `${sheet.themeLabel} · ${headline.trim() || sheet.themeLabel}`,
        url: getAppShareUrl(sheet.id),
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '카카오 공유에 실패했어요.'
      showStatus(message)
    } finally {
      setExporting(false)
    }
  }

  const handleImageShare = async () => {
    const root = getExportRoot()
    if (!root) {
      showStatus('엽서를 찾을 수 없어요.')
      return
    }

    setExporting(true)
    try {
      const blob = await capturePostcardBlob(root)
      const filename = buildPostcardFilename(sheet.sheetTitle, exportDateIso)
      const shared = await shareImageFile(blob, filename)
      if (!shared) {
        downloadBlob(blob, filename)
        window.alert('이 기기에서는 이미지 공유를 지원하지 않아 파일을 저장했어요.')
      }
    } catch {
      showStatus('이미지 공유에 실패했어요.')
    } finally {
      setExporting(false)
    }
  }

  const handleEdit = () => {
    setActiveSheetId(sheet.id)
    setStep('walk')
  }

  return (
    <div className="flex min-h-dvh flex-col pb-8">
      <AppBar
        title="완성된 컬러워크"
        showBack
        onBack={() => setStep('archive')}
        rightSlot={
          <button
            type="button"
            onClick={handleEdit}
            disabled={exporting}
            className="px-2 py-1 text-sm font-semibold text-on-surface underline underline-offset-4 disabled:opacity-50"
          >
            수정
          </button>
        }
      />
      <CompleteView>
        <SummaryBanner
          sheetTitle={sheet.sheetTitle}
          themeLabel={sheet.themeLabel}
          dateValue={dateValue}
          onDateChange={(d) => updateSheet(sheet.id, { completedAt: dateInputToIso(d) })}
        />
        <div className="px-page">
          <PostcardPreview ref={postcardRef} sheet={sheet} headline={headline} />
        </div>
        <div className="px-page">
          <label className="mb-1 block text-xs text-on-surface-variant">엽서 헤드라인</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value)
              updateSheet(sheet.id, { postcardHeadline: e.target.value })
            }}
            className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3"
          />
        </div>
        <ExportActions
          onSave={handleSave}
          onKakaoShare={handleKakao}
          onImageShare={handleImageShare}
          busy={exporting}
          kakaoDisabled={kakaoDisabled}
          statusMessage={statusMessage ?? offlineKakaoStatus}
        />
      </CompleteView>
    </div>
  )
}
