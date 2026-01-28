import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

function UpdatePrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered:', r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    const handleUpdate = () => {
        updateServiceWorker(true)
    }

    const handleClose = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    return (
        <AnimatePresence>
            {(offlineReady || needRefresh) && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
                >
                    <div className="glass-card p-4 border border-accent/20 shadow-2xl">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                                <RefreshCw className="w-5 h-5 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white mb-1">
                                    {offlineReady ? 'App ready for offline use' : 'Update available'}
                                </h3>
                                <p className="text-sm text-slate-400 mb-3">
                                    {offlineReady
                                        ? 'The app is now ready to work offline'
                                        : 'A new version is available. Reload to update.'}
                                </p>

                                <div className="flex gap-2">
                                    {needRefresh && (
                                        <button
                                            onClick={handleUpdate}
                                            className="px-4 py-2 bg-gradient-to-r from-accent to-primary text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-all"
                                        >
                                            Reload
                                        </button>
                                    )}
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 text-slate-400 text-sm font-semibold hover:text-white transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default UpdatePrompt
