import React, { useState } from 'react'
import Recorder from './components/Recorder'
import DataDisplay from './components/DataDisplay'
import Dashboard from './components/Dashboard'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
    const [result, setResult] = useState(null)
    const [view, setView] = useState('app') // 'app' or 'dashboard'

    return (
        <div className="w-full max-w-[500px] min-h-screen p-6 md:p-10 flex flex-col gap-8 relative pb-20">
            <header className="space-y-6">
                <div className="flex justify-between items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
                            Flux CRM
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                            Voice-First Intelligence
                        </p>
                    </motion.div>

                    <div className="stat-badge text-accent/80 border-accent/20">
                        v0.1.0 Beta
                    </div>
                </div>

                <div className="segmented-control">
                    <button
                        onClick={() => setView('app')}
                        className={`segmented-btn ${view === 'app' ? 'active' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Recorder
                    </button>
                    <button
                        onClick={() => setView('dashboard')}
                        className={`segmented-btn ${view === 'dashboard' ? 'active' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        History & Evals
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full relative">
                <AnimatePresence mode="wait">
                    {view === 'app' ? (
                        <motion.div
                            key="recorder"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <Recorder onResult={setResult} />

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                >
                                    <DataDisplay data={result} onChange={setResult} />
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Dashboard />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="absolute bottom-8 left-0 right-0 text-center opacity-20 text-[9px] tracking-[0.3em] font-bold uppercase pointer-events-none">
                Enterprise Grade • PWA Configured • Trusted Web Activity
            </footer>
        </div>
    )
}

export default App
