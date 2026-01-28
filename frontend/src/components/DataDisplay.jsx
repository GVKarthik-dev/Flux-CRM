import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, Loader2, User, Phone, MapPin, Building, FileText, Send, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const DataDisplay = ({ data, onChange }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!data) return null;

    const handleInputChange = (section, field, value) => {
        const newData = { ...data };
        newData.data[section][field] = value;
        onChange(newData);
    };

    const handleInteractionChange = (field, value) => {
        const newData = { ...data };
        newData.data.interaction[field] = value;
        onChange(newData);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                customer: data.data.customer,
                interaction: data.data.interaction,
                transcript: data.transcript
            };

            if (data.id) {
                // Update existing record
                await axios.put(`http://localhost:8000/history/${data.id}`, payload);
            } else {
                // Create new record
                const response = await axios.post('http://localhost:8000/history', payload);
                // Update parent state with the new ID so subsequent clicks are updates
                if (response.data.id) {
                    onChange({ ...data, id: response.data.id });
                }
            }

            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
        } catch (err) {
            console.error("Failed to sync to CRM:", err);
            alert("Failed to sync to CRM.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getIcon = (key) => {
        switch (key) {
            case 'full_name': return <User size={14} className="text-primary" />;
            case 'phone': return <Phone size={14} className="text-primary" />;
            case 'address': return <MapPin size={14} className="text-primary" />;
            case 'city': return <Building size={14} className="text-primary" />;
            case 'locality': return <MapPin size={14} className="text-primary" />;
            default: return <FileText size={14} className="text-primary" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card space-y-8 overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <FileText size={80} />
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span className="label !mb-0">Intel Transcript</span>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <p className="relative text-sm italic text-slate-300 bg-black/40 p-5 rounded-2xl border border-white/5 leading-relaxed">
                        "{data.transcript}"
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        <span className="label !mb-0">Entity Profile</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(data.data.customer).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <div className="flex items-center gap-2 ml-1">
                                {getIcon(key)}
                                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                    {key.replace('_', ' ')}
                                </label>
                            </div>
                            <input
                                className="input-field"
                                value={value || ''}
                                onChange={(e) => handleInputChange('customer', key, e.target.value)}
                                placeholder={`Identity ${key.replace('_', ' ')}...`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Send size={16} className="text-primary" />
                    <span className="label !mb-0">Intelligence Summary</span>
                </div>
                <textarea
                    className="input-field h-28 resize-none leading-relaxed"
                    value={data.data.interaction.summary || ''}
                    onChange={(e) => handleInteractionChange('summary', e.target.value)}
                    placeholder="Executive summary of the session..."
                />
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Code size={16} className="text-accent" />
                    <span className="label !mb-0 !text-accent">Protocol Output (JSON)</span>
                </div>
                <div className="bg-black/60 rounded-2xl p-5 border border-accent/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-3xl rounded-full" />
                    <pre className="text-[10px] text-accent/80 font-mono overflow-x-auto relative z-10 scrollbar-hide">
                        {JSON.stringify(data.data, null, 2)}
                    </pre>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isSubmitting || isSubmitted}
                className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-extrabold shadow-2xl transition-all duration-300 active:scale-[0.97] group ${isSubmitted
                    ? 'bg-success text-white'
                    : 'bg-gradient-to-r from-primary to-primary-hover text-white hover:shadow-primary/30'
                    } disabled:opacity-70`}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        <span className="tracking-wide">SYCHRONIZING...</span>
                    </>
                ) : isSubmitted ? (
                    <>
                        <CheckCircle2 size={20} className="animate-bounce" />
                        <span className="tracking-wide">PROTOCOL SYNCED</span>
                    </>
                ) : (
                    <>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span className="tracking-wide">DEPLOY TO CRM</span>
                    </>
                )}
            </button>
        </motion.div>
    );
};

export default DataDisplay;
