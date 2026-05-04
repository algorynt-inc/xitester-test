import { animate, useMotionValue, useTransform, motion } from 'framer-motion'
import { useEffect } from 'react'

export default function AnimatedNumber({
    value,
    decimals = 0,
    suffix = '',
}: {
    value: number
    decimals?: number
    suffix?: string
}) {
    const mv = useMotionValue(0)
    const display = useTransform(mv, latest => {
        const n = Number.isFinite(latest) ? latest : 0
        return n.toFixed(decimals) + suffix
    })

    useEffect(() => {
        const controls = animate(mv, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1] })
        return () => controls.stop()
    }, [mv, value])

    return <motion.span>{display}</motion.span>
}
