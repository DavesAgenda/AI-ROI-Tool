
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Button, Input, Label, Badge, cn } from './UI';
import { DecisionMatrix } from './DecisionMatrix';
import { TaskWizard } from './TaskWizard';
import { Plus, Trash2, Edit2, activity, ArrowRight, Save, X, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

// Constants
const WORKING_DAYS = 261;
const STORAGE_KEY = 'va-roi-state';
const WEBHOOK_URL = "https://hooks.validagenda.dev/webhook/roi-calculator";

const READINESS_FACTORS = [
    { id: 'process', label: 'Process is clearly defined', weight: 5 },
    { id: 'rules', label: 'Rules are strictly logical', weight: 5 },
    { id: 'digital', label: 'Input data is digital', weight: 3 },
    { id: 'output', label: 'Output is standardized', weight: 3 },
    { id: 'guardrails', label: 'Guardrails (Human-in-the-loop)', weight: 3 }, // Added per manifesto
    { id: 'volume', label: 'Volume is high', weight: 2 },
];

export default function Calculator() {
    // --- State ---
    const [tasks, setTasks] = useState([]);

    // Wizard State
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Lead Form State
    const [lead, setLead] = useState({
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        consent: false
    });
    const [leadStatus, setLeadStatus] = useState({ msg: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Effects ---
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.tasks && Array.isArray(parsed.tasks)) {
                    // Filter out invalid tasks to prevent crashes
                    const validTasks = parsed.tasks.filter(t => t && t.metrics);
                    setTasks(validTasks);
                }
            } catch (e) {
                console.error("Failed to load state", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks }));
    }, [tasks]);

    // --- Calculations ---
    const calculateMetrics = (v) => {
        const dailyMinutes = (parseFloat(v.freq) || 0) * (parseFloat(v.minutes) || 0);
        const annualHours = (dailyMinutes * WORKING_DAYS) / 60;
        const annualCost = annualHours * (parseFloat(v.hourly) || 0);
        const savings = annualCost * 0.5; // Assume 50% savings
        return { dailyMinutes, annualHours, annualCost, savings };
    };

    const calculateReadinessScore = (readinessMap) => {
        let score = 0;
        let total = 0;
        READINESS_FACTORS.forEach(f => {
            total += f.weight;
            if (readinessMap?.[f.id]) score += f.weight;
        });
        return total === 0 ? 0 : score / total;
    };

    const calculatePriority = (impactScore, viabilityScore) => {
        if (impactScore >= 50 && viabilityScore >= 50) return "Quick Win";
        if (impactScore < 50 && viabilityScore >= 50) return "Hobby";
        if (impactScore >= 50 && viabilityScore < 50) return "Strategic Bet";
        return "Trap";
    };

    const totals = tasks.reduce((acc, t) => {
        if (!t || !t.metrics) return acc;
        return {
            annualHours: acc.annualHours + (t.metrics.annualHours || 0),
            annualCost: acc.annualCost + (t.metrics.annualCost || 0),
            savings: acc.savings + (t.metrics.savings || 0),
            count: acc.count + 1
        };
    }, { annualHours: 0, annualCost: 0, savings: 0, count: 0 });

    // --- Handlers ---
    const handleSaveTask = (values) => {
        const metrics = calculateMetrics(values);
        const readinessScore = calculateReadinessScore(values.readiness);

        // Calculate priority for the PDF
        const maxImpact = Math.max(...tasks.map(t => t.metrics.annualCost), 1000);
        const impactScore = (metrics.annualCost / maxImpact) * 100;
        const painScore = (values.pain || 5) / 10;
        const viabilityScore = (readinessScore * 0.6 + painScore * 0.4) * 100;
        const priority = calculatePriority(impactScore, viabilityScore);

        const newTask = {
            id: editingTask?.id || Date.now().toString(),
            ...values,
            readinessScore,
            metrics,
            priority,
            timestamp: Date.now()
        };

        if (editingTask) {
            setTasks(prev => prev.map(t => t.id === editingTask.id ? newTask : t));
        } else {
            setTasks(prev => [...prev, newTask]);
        }

        setEditingTask(null);
        setIsWizardOpen(false);
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsWizardOpen(true);
    };

    const handleDelete = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const handleAddNew = () => {
        setEditingTask(null);
        setIsWizardOpen(true);
    };

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLeadStatus({ msg: 'Generating your report...', type: 'info' });

        // Capture Matrix Image with a slight delay to ensure Recharts is stable
        let matrixImage = null;
        try {
            const matrixEl = document.getElementById('decision-matrix-container');
            if (matrixEl) {
                // Wait for any animations to settle
                await new Promise(r => setTimeout(r, 500));

                const canvas = await html2canvas(matrixEl, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    allowTaint: true
                });
                matrixImage = canvas.toDataURL('image/png', 1.0);
            }
        } catch (e) {
            console.error("Failed to capture matrix", e);
        }

        const payload = {
            tasks,
            totals,
            lead,
            matrixImage
        };

        try {
            // 1. Send to Webhook
            try {
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (webhookErr) {
                console.warn("Webhook failed but proceeding to PDF", webhookErr);
            }

            // 2. Generate PDF via Next.js API
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("PDF generation failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Valid-Agenda-Automation-ROI-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setLeadStatus({ msg: 'Report downloaded successfully!', type: 'success' });
        } catch (err) {
            console.error(err);
            setLeadStatus({ msg: 'Error generating report. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Helpers ---
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    const formatNumber = (val) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);

    return (
        <div className="space-y-12">

            {/* Top Summary / Hero */}
            <div className="text-center space-y-6 mb-16 relative z-10 pt-4">
                <h2 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
                    Payback-first AI. <br />
                    <span className="text-[#F48847]">No science projects.</span>
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Quantify your <span className="text-[#F48847] font-semibold">recurring savings potential</span> and identify the workflows that actually matter.
                </p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="text-center py-8 border-orange-100 bg-orange-50/50">
                    <Label className="uppercase tracking-wider text-slate-500 mb-2">Cost of Inaction</Label>
                    <div className="text-5xl font-bold text-brand-orange">
                        {formatCurrency(totals.annualCost)}
                    </div>
                </GlassCard>
                <GlassCard className="text-center py-8">
                    <Label className="uppercase tracking-wider text-slate-500 mb-2">Hours Returned</Label>
                    <div className="text-5xl font-bold text-slate-900">
                        {formatNumber(totals.annualHours)}
                    </div>
                </GlassCard>
                <GlassCard className="text-center py-8">
                    <Label className="uppercase tracking-wider text-slate-500 mb-2">Audit Opportunities</Label>
                    <div className="text-5xl font-bold text-slate-900">
                        {totals.count}
                    </div>
                </GlassCard>
            </div>

            {/* Call to Action for New Task */}
            <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleAddNew} className="text-lg px-8 py-4 shadow-2xl shadow-orange-500/20 hover:scale-105 transition-transform">
                    <Plus className="w-6 h-6 mr-2" /> Add Audit Opportunity
                </Button>
            </div>

            {/* Final Book a Call CTA */}
            <div className="mt-20 pt-12 border-t border-slate-200 text-center space-y-6">
                <h3 className="text-2xl font-bold text-slate-900">Need help building your payback roadmap?</h3>
                <p className="text-slate-600 max-w-xl mx-auto">
                    We help finance and ops teams build their first payback-generating agents in 30 days.
                </p>
                <a
                    href="https://validagenda.com/book"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-8 py-4 text-lg font-bold hover:bg-slate-800 transition-colors shadow-xl"
                >
                    Book a Strategy Call <ArrowRight className="w-5 h-5 ml-2" />
                </a>
            </div>

            {/* Wizard Modal */}
            <TaskWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                onSave={handleSaveTask}
                initialValues={editingTask}
                readinessFactors={READINESS_FACTORS}
            />

            {/* Matrix Grid - Full Width now */}
            <div className="w-full">
                <GlassCard id="decision-matrix-container" className="p-6 h-[600px] flex flex-col">
                    <DecisionMatrix tasks={tasks} />
                    <div className="mt-4 flex justify-center text-sm text-slate-400 gap-8">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Quick Payback</span>
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400" /> Low Hanging Fruit</span>
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> Strategic Bets</span>
                    </div>
                </GlassCard>
            </div>

            {/* Task List */}
            {tasks.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">Audit Inventory</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {tasks.map(task => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <GlassCard className="h-full flex flex-col justify-between group hover:border-orange-500/30 transition-colors">
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-slate-900 text-lg">{task.task}</h4>
                                                <Badge variant={task.metrics.annualCost > 10000 ? 'success' : 'default'}>
                                                    {formatCurrency(task.metrics.annualCost)}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-slate-500 space-y-1 mb-4">
                                                <div className="flex justify-between border-b border-slate-100 pb-1">
                                                    <span>Role</span> <span className="text-slate-700">{task.role}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-slate-100 pb-1">
                                                    <span>Hours Returned</span> <span className="text-slate-700 font-mono">{formatNumber(task.metrics.annualHours)}</span>
                                                </div>
                                                <div className="flex justify-between pt-1">
                                                    <span>Viability</span> <span className="text-slate-700">{Math.round(task.readinessScore * 100)}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="secondary" size="sm" onClick={() => handleEdit(task)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(task.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Lead Form */}
            {tasks.length > 0 && (
                <GlassCard className="max-w-4xl mx-auto p-8 md:p-12 relative overflow-hidden border-orange-200 shadow-2xl shadow-orange-500/10">
                    <div className="absolute top-0 right-0 p-40 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 p-32 bg-slate-900/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-left space-y-6">
                            <h3 className="text-3xl md:text-3xl font-bold text-slate-900">
                                Unlock Your Payback Blueprint
                            </h3>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Get a professional breakdown of your capital recovery potential, complete with a prioritized roadmap and next steps.
                            </p>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex items-center gap-3">
                                    <div className="p-1 rounded bg-brand-orange/10 text-brand-orange"><CheckCircle className="w-4 h-4" /></div>
                                    Full Capital Recovery Analysis
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="p-1 rounded bg-brand-orange/10 text-brand-orange"><CheckCircle className="w-4 h-4" /></div>
                                    Priority Implementation Matrix
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="p-1 rounded bg-brand-orange/10 text-brand-orange"><CheckCircle className="w-4 h-4" /></div>
                                    PDF Report for Stakeholders
                                </li>
                            </ul>
                        </div>

                        <form onSubmit={handleLeadSubmit} className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase">First Name</Label>
                                    <Input
                                        value={lead.firstName}
                                        onChange={(e) => setLead(p => ({ ...p, firstName: e.target.value }))}
                                        required
                                        className="py-2 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase">Last Name</Label>
                                    <Input
                                        value={lead.lastName}
                                        onChange={(e) => setLead(p => ({ ...p, lastName: e.target.value }))}
                                        required
                                        className="py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase">Business Email</Label>
                                <Input
                                    type="email"
                                    value={lead.email}
                                    onChange={(e) => setLead(p => ({ ...p, email: e.target.value }))}
                                    required
                                    className="py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs uppercase">Role</Label>
                                <Input
                                    value={lead.role}
                                    onChange={(e) => setLead(p => ({ ...p, role: e.target.value }))}
                                    required
                                    className="py-2 text-sm"
                                />
                            </div>

                            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange/20 bg-white accent-brand-orange"
                                    checked={lead.consent}
                                    onChange={(e) => setLead(p => ({ ...p, consent: e.target.checked }))}
                                />
                                <span className="text-xs text-slate-500">
                                    I agree to receive the report and related payback insights. No spam.
                                </span>
                            </label>

                            <Button disabled={isSubmitting} variant="primary" size="lg" className="w-full text-base font-bold">
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Generating Blueprint...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Download className="w-5 h-5" />
                                        Get The Payback Blueprint
                                    </span>
                                )}
                            </Button>

                            {leadStatus.msg && (
                                <div className={cn("p-3 text-sm rounded-lg flex items-center gap-2",
                                    leadStatus.type === 'error' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                                        leadStatus.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                            "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                )}>
                                    {leadStatus.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                    {leadStatus.msg}
                                </div>
                            )}
                        </form>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
