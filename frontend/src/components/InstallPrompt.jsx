import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'

function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault()
            setDeferredPrompt(e)

            // Show prompt after a short delay (better UX)
            setTimeout(() => {
                setShowPrompt(true)
            }, 3000)
        }

        // Listen for successful installation
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setShowPrompt(false)
            setDeferredPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        // Show the install prompt
        deferredPrompt.prompt()

        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt')
        } else {
            console.log('User dismissed the install prompt')
        }

        // Clear the deferred prompt
        setDeferredPrompt(null)
        setShowPrompt(false)
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        // Show again after 24 hours
        localStorage.setItem('installPromptDismissed', Date.now().toString())
    }

    // Don't show if already installed or no prompt available
    if (isInstalled || !showPrompt || !deferredPrompt) {
        return null
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
            >
                <div className="glass-card p-4 border border-primary/20 shadow-2xl">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                            <Download className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white mb-1">
                                Install Flux CRM
                            </h3>
                            <p className="text-sm text-slate-400 mb-3">
                                Install our app for quick access and offline support
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleInstallClick}
                                    className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all"
                                >
                                    Install
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                                >
                                    Not now
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleDismiss}
                            className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default InstallPrompt
