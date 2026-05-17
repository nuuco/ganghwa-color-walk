import { useCallback, useEffect, useRef, useState } from 'react'
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'

const MAX_ZOOM_FACTOR = 4

interface CellDetailImageViewerProps {
  imageUrl: string
}

function computeFitScale(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
): number {
  if (containerWidth <= 0 || containerHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return 1
  }
  return Math.min(containerWidth / imageWidth, containerHeight / imageHeight, 1)
}

/** 이미지 실제 크기 기준 가로·세로 중앙 정렬 */
function getFitTransform(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
  scale: number,
): { positionX: number; positionY: number; scale: number } {
  const contentWidth = imageWidth * scale
  const contentHeight = imageHeight * scale
  return {
    scale,
    positionX: (containerWidth - contentWidth) / 2,
    positionY: (containerHeight - contentHeight) / 2,
  }
}

export function CellDetailImageViewer({ imageUrl }: CellDetailImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null)
  const fitScaleRef = useRef(1)
  const [scaleBounds, setScaleBounds] = useState<{ min: number; max: number } | null>(null)

  const applyFit = useCallback((img: HTMLImageElement) => {
    const container = containerRef.current
    if (!container || !img.naturalWidth || !img.naturalHeight) return

    const fit = computeFitScale(
      container.clientWidth,
      container.clientHeight,
      img.naturalWidth,
      img.naturalHeight,
    )
    fitScaleRef.current = fit
    setScaleBounds({ min: fit, max: fit * MAX_ZOOM_FACTOR })

    const { positionX, positionY, scale } = getFitTransform(
      container.clientWidth,
      container.clientHeight,
      img.naturalWidth,
      img.naturalHeight,
      fit,
    )
    transformRef.current?.setTransform(positionX, positionY, scale, 0)
  }, [])

  useEffect(() => {
    fitScaleRef.current = 1
    setScaleBounds(null)
  }, [imageUrl])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !scaleBounds) return

    const observer = new ResizeObserver(() => {
      const img = container.querySelector('img')
      if (img instanceof HTMLImageElement && img.naturalWidth) {
        applyFit(img)
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [applyFit, scaleBounds])

  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      applyFit(event.currentTarget)
    },
    [applyFit],
  )

  return (
    <div ref={containerRef} className="relative flex min-h-0 w-full flex-1 touch-none select-none">
      {!scaleBounds ? (
        <img
          src={imageUrl}
          alt=""
          className="pointer-events-none absolute opacity-0"
          onLoad={handleImageLoad}
        />
      ) : null}

      {scaleBounds ? (
        <TransformWrapper
          key={imageUrl}
          ref={transformRef}
          initialScale={scaleBounds.min}
          minScale={scaleBounds.min}
          maxScale={scaleBounds.max}
          limitToBounds
          wheel={{ disabled: true }}
          pinch={{ step: 5 }}
          panning={{ velocityDisabled: true }}
          doubleClick={{ disabled: true }}
          onInit={(ref) => {
            transformRef.current = ref
            const img = containerRef.current?.querySelector('img')
            if (img instanceof HTMLImageElement && img.naturalWidth) {
              applyFit(img)
            }
          }}
        >
          <TransformComponent
            wrapperClass="!h-full !w-full"
            contentClass="!inline-block"
          >
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              onLoad={handleImageLoad}
              className="pointer-events-none max-h-none max-w-none"
              style={{ display: 'block' }}
            />
          </TransformComponent>
        </TransformWrapper>
      ) : null}
    </div>
  )
}
