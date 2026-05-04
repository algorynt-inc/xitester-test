import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Download, Film, Image as ImageIcon, Play, X } from 'lucide-react'
import { attachmentUrl } from '@/lib/results-loader'
import type { ResultAttachment } from '@/types'

interface Props {
    attachments: ResultAttachment[]
}

const isImage = (a: ResultAttachment) => (a.contentType ?? '').startsWith('image/')
const isVideo = (a: ResultAttachment) => (a.contentType ?? '').startsWith('video/')
const isTrace = (a: ResultAttachment) =>
    a.name.toLowerCase().includes('trace') || (a.contentType === 'application/zip')

export default function AttachmentGallery({ attachments }: Props) {
    const visible = attachments.filter(a => attachmentUrl(a) !== null)
    if (visible.length === 0) return null

    const images = visible.filter(isImage)
    const videos = visible.filter(isVideo)
    const traces = visible.filter(isTrace)
    const others = visible.filter(a => !isImage(a) && !isVideo(a) && !isTrace(a))

    const [lightbox, setLightbox] = useState<number | null>(null)

    useEffect(() => {
        if (lightbox === null) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(null)
            if (e.key === 'ArrowLeft') setLightbox(i => (i === null ? null : Math.max(0, i - 1)))
            if (e.key === 'ArrowRight') setLightbox(i => (i === null ? null : Math.min(images.length - 1, i + 1)))
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightbox, images.length])

    return (
        <div className="space-y-4">
            {images.length > 0 && (
                <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-tremor-content dark:text-dark-tremor-content mb-2">
                        <ImageIcon className="h-3.5 w-3.5" />
                        Screenshots ({images.length})
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {images.map((a, i) => (
                            <motion.button
                                key={a.url}
                                type="button"
                                onClick={() => setLightbox(i)}
                                whileHover={{ y: -2, scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                                className="group relative overflow-hidden rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border bg-tremor-background-muted dark:bg-dark-tremor-background-muted aspect-video focus:outline-none focus:ring-2 focus:ring-tremor-brand"
                            >
                                <img
                                    src={attachmentUrl(a)!}
                                    alt={a.name}
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                <span className="absolute bottom-1.5 left-1.5 right-1.5 truncate text-[10px] font-medium text-white drop-shadow bg-black/40 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {a.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {videos.length > 0 && (
                <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-tremor-content dark:text-dark-tremor-content mb-2">
                        <Film className="h-3.5 w-3.5" />
                        Videos ({videos.length})
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {videos.map(a => (
                            <motion.div
                                key={a.url}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="rounded-tremor-default overflow-hidden border border-tremor-border dark:border-dark-tremor-border bg-black"
                            >
                                <video
                                    controls
                                    preload="metadata"
                                    className="w-full aspect-video"
                                    src={attachmentUrl(a)!}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {traces.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {traces.map(a => {
                        const url = attachmentUrl(a)!
                        const traceViewerUrl = `https://trace.playwright.dev/?trace=${encodeURIComponent(url)}`
                        return (
                            <a
                                key={a.url}
                                href={traceViewerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-tremor-default text-sm font-medium bg-tremor-brand text-white hover:opacity-90 transition-opacity"
                            >
                                <Play className="h-3.5 w-3.5" />
                                Open in Trace Viewer
                            </a>
                        )
                    })}
                </div>
            )}

            {others.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {others.map(a => (
                        <a
                            key={a.url}
                            href={attachmentUrl(a)!}
                            download
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-tremor-default text-xs border border-tremor-border dark:border-dark-tremor-border text-tremor-content dark:text-dark-tremor-content hover:text-tremor-content-strong dark:hover:text-dark-tremor-content-strong transition-colors"
                        >
                            <Download className="h-3 w-3" />
                            {a.name}
                        </a>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {lightbox !== null && images[lightbox] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setLightbox(null)}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setLightbox(null) }}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setLightbox(i => (i === null || i === 0 ? null : i - 1)) }}
                                    disabled={lightbox === 0}
                                    className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setLightbox(i => (i === null || i === images.length - 1 ? i : i + 1)) }}
                                    disabled={lightbox === images.length - 1}
                                    className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                        <motion.img
                            key={lightbox}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            src={attachmentUrl(images[lightbox])!}
                            alt={images[lightbox].name}
                            onClick={(e) => e.stopPropagation()}
                            className="max-h-full max-w-full rounded-lg shadow-2xl"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs">
                            {lightbox + 1} / {images.length} · {images[lightbox].name}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
