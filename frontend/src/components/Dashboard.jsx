import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, Trash2, Save, Loader2, Database, Brain, Clock, User, FileText, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [evalResults, setEvalResults] = useState([]);
    const [dbResults, setDbResults] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            try {
                const evalsRes = await fetch('/eval_results.json');
                const evalsData = await evalsRes.json();
                setEvalResults(evalsData);
            } catch (e) { console.warn("Static evals not found"); }

            const dbRes = await axios.get('http://localhost:8000/history');
            setDbResults(dbRes.data);
        } catch (err) {
            console.error("Error loading dashboard data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const results = [...dbResults, ...evalResults];
    const liveCount = dbResults.length;
    const evalCount = evalResults.length;

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setConfirmDeleteId(id);
    };

    const performDelete = async () => {
        const id = confirmDeleteId;
        setConfirmDeleteId(null);
        setIsActionLoading(id);
        try {
            await axios.delete(`http://localhost:8000/history/${id}`);
            setDbResults(prev => prev.filter(item => item.id !== id));
            if (expandedId === id) setExpandedId(null);
        } catch (err) {
            alert("Failed to delete record.");
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleUpdate = async (id, updatedData) => {
        setIsActionLoading(id);
        try {
            await axios.put(`http://localhost:8000/history/${id}`, updatedData);
            alert("Record updated successfully!");
            fetchData();
        } catch (err) {
            alert("Failed to update record.");
        } finally {
            setIsActionLoading(null);
        }
    };

    const updateLocalField = (id, section, field, value) => {
        setDbResults(prev => prev.map(item => {
            if (item.id === id) {
                const newOutput = { ...item.output };
                newOutput[section][field] = value;
                const updates = { output: newOutput };
                if (section === 'customer') {
                    if (field === 'full_name' && 'customer_name' in item) {
                        updates['customer_name'] = value;
                    } else if (field in item) {
                        updates[field] = value;
                    }
                }
                return { ...item, ...updates };
            }
            return item;
        }));
    };

    const updateLocalSummary = (id, value) => {
        setDbResults(prev => prev.map(item => {
            if (item.id === id) {
                const newOutput = { ...item.output };
                newOutput.interaction.summary = value;
                return { ...item, output: newOutput, summary: value };
            }
            return item;
        }));
    };

    const updateLocalTranscript = (id, value) => {
        setDbResults(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, input: value };
            }
            return item;
        }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card !p-4 flex items-center gap-4 glass-accent">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex justify-center items-center text-primary">
                        <Database size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Live Data</p>
                        <p className="text-xl font-extrabold text-white">{liveCount}</p>
                    </div>
                </div>
                <div className="card !p-4 flex items-center gap-4 glass-accent">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex justify-center items-center text-accent">
                        <Brain size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Evals Cache</p>
                        <p className="text-xl font-extrabold text-white">{evalCount}</p>
                    </div>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <Activity size={16} className="text-primary" />
                    <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Intelligence Feed</h3>
                </div>

                <div className="space-y-4">
                    {results.length === 0 ? (
                        <div className="card py-20 flex flex-col items-center justify-center opacity-40 border-dashed">
                            <Clock size={48} className="mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest">No Intelligence History Found</p>
                        </div>
                    ) : (
                        results.map((res, idx) => {
                            const isExpanded = expandedId === res.id;
                            const name = (res.customer_name && res.customer_name !== 'N/A')
                                ? res.customer_name
                                : (res.output?.customer?.full_name && res.output?.customer?.full_name !== 'N/A')
                                    ? res.output.customer.full_name
                                    : 'Unknown Entity';

                            return (
                                <motion.div
                                    key={res.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`card !p-0 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/20 border-primary/20 bg-primary/5' : 'hover:bg-white/[0.02]'}`}
                                >
                                    {/* ... rest of the card content ... */}
                                    <div
                                        onClick={() => toggleExpand(res.id)}
                                        className="p-5 flex items-center justify-between cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex justify-center items-center text-lg font-bold shadow-inner ${res.status === 'REAL' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-400'}`}>
                                                {name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{name}</h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${res.status === 'REAL' ? 'bg-primary/20 text-primary' : 'bg-orange-500/20 text-orange-400'}`}>
                                                        {res.status === 'REAL' ? 'Live' : 'Eval'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1"><Clock size={10} /> {new Date(res.created_at || res.output?.interaction?.created_at).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1 uppercase tracking-tighter"><Database size={10} /> {String(res.id).slice(0, 5)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {res.status === 'REAL' && (
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, res.id)}
                                                    className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                                                    title="Purge Record"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                            <motion.div
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                className="text-slate-600"
                                            >
                                                <ChevronDown size={20} />
                                            </motion.div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5 bg-black/20"
                                            >
                                                <div className="p-6 space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 ml-1">
                                                                    <FileText size={12} className="text-primary" />
                                                                    <span className="label !mb-0 text-primary">Original Intelligence</span>
                                                                </div>
                                                                <textarea
                                                                    className="input-field h-28 resize-none !text-[11px] leading-relaxed"
                                                                    value={res.input || ''}
                                                                    onChange={(e) => res.status === 'REAL' && updateLocalTranscript(res.id, e.target.value)}
                                                                    disabled={res.status !== 'REAL'}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                {['full_name', 'phone', 'city', 'locality'].map((field) => (
                                                                    <div key={field} className="space-y-1">
                                                                        <label className="label ml-1">{field.replace('_', ' ')}</label>
                                                                        <input
                                                                            className="input-field !p-2 !text-[11px]"
                                                                            value={field === 'full_name' ? (res.customer_name || res.output?.customer?.full_name || '') : (res[field] || res.output?.customer?.[field] || '')}
                                                                            onChange={(e) => res.status === 'REAL' && updateLocalField(res.id, 'customer', field, e.target.value)}
                                                                            disabled={res.status !== 'REAL'}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 ml-1">
                                                                    <Activity size={12} className="text-primary" />
                                                                    <span className="label !mb-0 text-primary">Extracted Insight</span>
                                                                </div>
                                                                <textarea
                                                                    className="input-field h-28 resize-none !text-[11px] leading-relaxed"
                                                                    value={res.output?.interaction?.summary || ''}
                                                                    onChange={(e) => res.status === 'REAL' && updateLocalSummary(res.id, e.target.value)}
                                                                    disabled={res.status !== 'REAL'}
                                                                />
                                                            </div>
                                                            {res.status === 'REAL' && (
                                                                <button
                                                                    onClick={() => handleUpdate(res.id, res)}
                                                                    disabled={isActionLoading === res.id}
                                                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-extrabold flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase shadow-xl active:scale-[0.98] transition-all"
                                                                >
                                                                    {isActionLoading === res.id ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                                                    Force Update CRM
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            <AnimatePresence>
                {confirmDeleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={() => setConfirmDeleteId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="modal-content text-center space-y-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex justify-center items-center mx-auto shadow-inner">
                                <Trash2 size={40} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-extrabold text-white">Purge Intelligence?</h3>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                    This action will permanently remove this record from the central intelligence core. This cannot be undone.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    onClick={performDelete}
                                    className="w-full h-14 rounded-2xl bg-red-500 text-white font-extrabold shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all"
                                >
                                    Confirm Purge
                                </button>
                                <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="w-full h-14 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all active:scale-[0.98]"
                                >
                                    Abort Operation
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
