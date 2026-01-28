import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'

function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [showOffline, setShowOffline] = useState(false)
    const [showBackOnline, setShowBackOnline] = useState(false)

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            setShowOffline(false)
            setShowBackOnline(true)

            // Hide "back online" message after 3 seconds
            setTimeout(() => {
                setShowBackOnline(false)
            }, 3000)
        }

        const handleOffline = () => {
            setIsOnline(false)
            setShowOffline(true)
            setShowBackOnline(false)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Set initial state
        if (!navigator.onLine) {
            setShowOffline(true)
        }

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return (
        <>
            {/* Offline Banner */}
            <AnimatePresence>
                {showOffline && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-0 left-0 right-0 z-50"
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 shadow-lg">
                            <div className="max-w-[500px] mx-auto flex items-center justify-center gap-2">
                                <WifiOff className="w-5 h-5" />
                                <span className="font-semibold text-sm">
                                    You're offline. Some features may be limited.
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Online Toast */}
            <AnimatePresence>
                {showBackOnline && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="glass-card px-6 py-3 border border-green-500/30 shadow-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Wifi className="w-4 h-4 text-green-400" />
                                </div>
                                <span className="font-semibold text-sm text-white">
                                    Back online!
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default OfflineIndicator
