
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, Button, Input, Label, GlassCard } from './UI';
import { ArrowRight, ArrowLeft, CheckCircle, Calculator as CalcIcon, AlertCircle } from 'lucide-react';

const STEPS = [
    { id: 'context', title: 'The Opportunity' },
    { id: 'cost', title: 'Cost Analysis' },
    { id: 'viability', title: 'Viability Check' }
];

export function TaskWizard({ isOpen, onClose, onSave, initialValues, readinessFactors }) {
    const [step, setStep] = useState(0);
    const [values, setValues] = useState({
        task: '',
        role: '',
        freq: 0,
        minutes: 0,
        hourly: 0,
        pain: 5,
        readiness: {}
    });

    useEffect(() => {
        if (isOpen) {
            if (initialValues) {
                setValues(initialValues);
            } else {
                setValues({
                    task: '',
                    role: '',
                    freq: '',
                    minutes: '',
                    hourly: '',
                    pain: 5,
                    readiness: readinessFactors.reduce((acc, f) => ({ ...acc, [f.id]: false }), {})
                });
            }
            setStep(0);
        }
    }, [isOpen, initialValues, readinessFactors]);

    const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    const handleSave = () => {
        onSave(values);
        onClose();
    };

    const updateValue = (field, val) => setValues(prev => ({ ...prev, [field]: val }));
    const toggleReadiness = (id) => setValues(prev => ({
        ...prev,
        readiness: { ...prev.readiness, [id]: !prev.readiness[id] }
    }));

    // Live preview of cost
    const workingDays = 261;
    const annualCost = ((parseFloat(values.freq || 0) * parseFloat(values.minutes || 0) * workingDays) / 60) * parseFloat(values.hourly || 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-full max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {initialValues ? 'Edit Audit Item' : 'New Audit Item'}
                        </h3>
                        <p className="text-sm text-slate-400">Step {step + 1} of {STEPS.length}: {STEPS[step].title}</p>
                    </div>
                    {annualCost > 0 && (
                        <div className="text-right">
                            <div className="text-xs text-slate-500 uppercase tracking-wide">Est. Potential</div>
                            <div className="text-emerald-400 font-bold font-mono">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(annualCost)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-slate-800 w-full relative">
                    <motion.div
                        className="absolute h-full bg-gradient-to-r from-orange-500 to-amber-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-800/20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {step === 0 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Process Name</Label>
                                        <Input
                                            autoFocus
                                            placeholder="e.g. Month-End Reconciliation"
                                            value={values.task}
                                            onChange={e => updateValue('task', e.target.value)}
                                        />
                                        <p className="text-xs text-slate-500">What is the specific activity being performed?</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role Executing</Label>
                                        <Input
                                            placeholder="e.g. Senior Controller"
                                            value={values.role}
                                            onChange={e => updateValue('role', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Frequency (Daily)</Label>
                                            <Input
                                                type="number" step="0.1"
                                                placeholder="1"
                                                value={values.freq}
                                                onChange={e => updateValue('freq', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Minutes per Run</Label>
                                            <Input
                                                type="number"
                                                placeholder="45"
                                                value={values.minutes}
                                                onChange={e => updateValue('minutes', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Hourly Cost ($)</Label>
                                        <Input
                                            type="number"
                                            placeholder="85"
                                            value={values.hourly}
                                            onChange={e => updateValue('hourly', e.target.value)}
                                        />
                                        <p className="text-xs text-slate-500">Fully loaded hourly cost of the resource.</p>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <Label>Pain / Friction Score</Label>
                                            <span className="text-orange-400 font-bold text-xl">{values.pain}/10</span>
                                        </div>
                                        <input
                                            type="range" min="1" max="10"
                                            value={values.pain}
                                            onChange={e => updateValue('pain', parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Minor Annoyance</span>
                                            <span>Critical Bottleneck</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Payback Viability (Guardrails)</Label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {readinessFactors.map(factor => (
                                                <label key={factor.id} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 transition cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={values.readiness?.[factor.id]}
                                                        onChange={() => toggleReadiness(factor.id)}
                                                        className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500/20 bg-slate-700 accent-emerald-500"
                                                    />
                                                    <span className="text-sm text-slate-300 group-hover:text-slate-100">{factor.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-slate-900 flex justify-between items-center">
                    {step > 0 ? (
                        <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < STEPS.length - 1 ? (
                        <Button variant="primary" onClick={handleNext}>
                            Next Step <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleSave} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:to-emerald-400 border-0 shadow-emerald-500/20">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {initialValues ? 'Save Changes' : 'Add to Audit'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
