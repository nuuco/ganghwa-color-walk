import { useEffect, useRef, useState } from 'react'
import { AppBar } from '../components/layout/AppBar'
import { AppBarAction } from '../components/layout/AppBarAction'
import { PencilIcon } from '../components/ui/PencilIcon'
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
import { useCompletionCelebration } from '../hooks/useCompletionCelebration'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { isKakaoConfigured, shareKakaoFeed } from '../lib/kakao'

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
  const {
    getActiveSheet,
    setStep,
    openWalkForEdit,
    canCelebrateSheet,
    markSheetCelebrated,
  } = useApp()
  const isOnline = useOnlineStatus()
  const sheet = getActiveSheet()
  const postcardRef = useRef<HTMLElement>(null)
  const [exporting, setExporting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | undefined>()
  const shouldCelebrate = Boolean(sheet && canCelebrateSheet(sheet.id))
  const { celebrating } = useCompletionCelebration({
    sheetId: sheet?.id ?? '',
    shouldCelebrate,
    onCelebrated: markSheetCelebrated,
  })

  useEffect(() => {
    if (!sheet) return
    window.scrollTo({ top: 0, left: 0 })
  }, [sheet?.id])

  if (!sheet) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <button type="button" onClick={() => setStep('archive')} className="underline">
          목록으로
        </button>
      </div>
    )
  }

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
        description: sheet.themeLabel,
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
    openWalkForEdit(sheet.id)
  }

  return (
    <div className="flex min-h-dvh flex-col pb-8">
      <AppBar
        title="완성된 컬러워크"
        showBack
        onBack={() => setStep('archive')}
        rightSlot={
          <AppBarAction onClick={handleEdit} disabled={exporting} aria-label="수정">
            <PencilIcon size={14} className="text-outline" />
            수정
          </AppBarAction>
        }
      />
      <CompleteView>
        <SummaryBanner celebrating={celebrating} />
        <div className="px-page">
          <PostcardPreview ref={postcardRef} sheet={sheet} />
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
