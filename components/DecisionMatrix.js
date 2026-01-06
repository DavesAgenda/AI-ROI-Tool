
import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, ReferenceArea, Label } from 'recharts';
import { GlassCard } from './UI';

export function DecisionMatrix({ tasks }) {
    // Transform tasks for the chart
    // X-Axis: Impact (Annual Cost Savings)
    // Y-Axis: Ease of Implementation (Derived from Readiness & Pain)

    const maxImpact = Math.max(...tasks.map(t => t.metrics.annualCost), 1000);

    const data = tasks.map(task => {
        // Normalize Impact (0-100)
        const impactScore = (task.metrics.annualCost / maxImpact) * 100;

        // Normalize Ease (0-100)
        // Higher Readiness (0-1) + Higher Pain (1-10) -> Higher Priority
        // Originally: (1 - readiness) + (10 - pain)/25 was "Effort" (Lower is better)
        // Let's invert it for "Ease/Priority": 
        // Readiness is 0-1 (1 is fully ready). Pain is 1-10 (10 is high pain).
        // We want Y to be "Priority". High Pain + High Readiness = Top Right (Quick Wins)?
        // Or High Impact + High Ease = Quick Wins.

        // Let's stick to the matrix standard:
        // X: Impact (Cost)
        // Y: Ease (Readiness)

        // Using a composite score for Y akin to the original logic but normalized 0-100
        // Original Effort = (1 - readiness) + (10 - pain) / 25. Range approx 0 to 1.4
        // We want "Ease" -> 100 - (Effort * 100 / 1.4) roughly.

        const readinessScore = task.readinessScore || 0; // 0 to 1
        const painScore = (task.pain || 5) / 10; // 0.1 to 1

        // Composite "Viability" score
        const viability = (readinessScore * 0.6 + painScore * 0.4) * 100;

        return {
            ...task,
            x: impactScore,
            y: viability,
            z: 1, // Bubble size
        };
    });

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 border border-slate-200 p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="font-bold text-slate-900">{data.task}</p>
                    <div className="text-xs text-slate-500 mt-1 space-y-1">
                        <p>Annual Savings: <span className="text-brand-orange font-semibold">${data.metrics.annualCost.toLocaleString()}</span></p>
                        <p>Viability Score: <span className="text-slate-700">{Math.round(data.y)}/100</span></p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <GlassCard className="h-[500px] w-full flex flex-col">
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">
                    Decision Matrix
                </h3>
                <div className="text-xs text-slate-500 flex gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-brand-orange"></div> Quick Wins</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-800"></div> Major Projects</span>
                </div>
            </div>

            <div className="flex-1 w-full relative">
                {data.length === 0 && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center text-slate-400 text-sm">
                        Add tasks to visualize priorities
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        {/* Quadrant Backgrounds */}

                        {/* Top Right: High Impact, High Viability -> Quick Wins */}
                        <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="#F48847" fillOpacity={0.05} />

                        {/* Top Left: Low Impact, High Viability -> Low Hanging Fruit */}
                        <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="#64748B" fillOpacity={0.05} />

                        {/* Bottom Right: High Impact, Low Viability -> Major Projects/Long Term */}
                        <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="#0A0A0A" fillOpacity={0.05} />

                        {/* Bottom Left: Low Impact, Low Viability -> Thankless Tasks */}
                        <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="#E2E8F0" fillOpacity={0.1} />

                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Impact"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                        >
                            <Label value="Impact (Cost Savings)" offset={-10} position="insideBottom" fill="#64748b" style={{ fontSize: 12 }} />
                        </XAxis>
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Viability"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                        >
                            <Label value="Viability (Readiness)" angle={-90} position="insideLeft" fill="#64748b" style={{ fontSize: 12 }} />
                        </YAxis>
                        <ZAxis type="number" dataKey="z" range={[60, 400]} />

                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#94a3b8' }} />

                        <Scatter name="Tasks" data={data}>
                            {data.map((entry, index) => {
                                // Color logic based on quadrant
                                let color = "#94a3b8"; // Default slate
                                if (entry.x >= 50 && entry.y >= 50) color = "#F48847"; // Brand Orange (Quick Win)
                                else if (entry.x < 50 && entry.y >= 50) color = "#64748B"; // Slate (Low Hanging)
                                else if (entry.x >= 50 && entry.y < 50) color = "#0A0A0A"; // Black (Major)

                                return <Cell key={`cell-${index}`} fill={color} stroke="white" strokeWidth={2} />;
                            })}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
