
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
                <div className="bg-slate-900/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="font-bold text-slate-100">{data.task}</p>
                    <div className="text-xs text-slate-400 mt-1 space-y-1">
                        <p>Annual Savings: <span className="text-emerald-400">${data.metrics.annualCost.toLocaleString()}</span></p>
                        <p>Viability Score: <span className="text-orange-400">{Math.round(data.y)}/100</span></p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <GlassCard className="h-[500px] w-full flex flex-col">
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Decision Matrix
                </h3>
                <div className="text-xs text-slate-400 flex gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Quick Wins</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Major Projects</span>
                </div>
            </div>

            <div className="flex-1 w-full relative">
                {data.length === 0 && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center text-slate-500 text-sm">
                        Add tasks to visualize priorities
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        {/* Quadrant Backgrounds */}

                        {/* Top Right: High Impact, High Viability -> Quick Wins */}
                        <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="#10B981" fillOpacity={0.05} />

                        {/* Top Left: Low Impact, High Viability -> Low Hanging Fruit */}
                        <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="#3B82F6" fillOpacity={0.05} />

                        {/* Bottom Right: High Impact, Low Viability -> Major Projects/Long Term */}
                        <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="#F59E0B" fillOpacity={0.05} />

                        {/* Bottom Left: Low Impact, Low Viability -> Thankless Tasks */}
                        <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="#64748B" fillOpacity={0.05} />

                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Impact"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }}
                        >
                            <Label value="Impact (Cost Savings)" offset={-10} position="insideBottom" fill="#94a3b8" style={{ fontSize: 12 }} />
                        </XAxis>
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Viability"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }}
                        >
                            <Label value="Viability (Readiness)" angle={-90} position="insideLeft" fill="#94a3b8" style={{ fontSize: 12 }} />
                        </YAxis>
                        <ZAxis type="number" dataKey="z" range={[60, 400]} />

                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#ffffff30' }} />

                        <Scatter name="Tasks" data={data}>
                            {data.map((entry, index) => {
                                // Color logic based on quadrant
                                let color = "#64748B"; // Default slate
                                if (entry.x >= 50 && entry.y >= 50) color = "#34D399"; // Emerald (Quick Win)
                                else if (entry.x < 50 && entry.y >= 50) color = "#60A5FA"; // Blue (Low Hanging)
                                else if (entry.x >= 50 && entry.y < 50) color = "#FBBF24"; // Amber (Major)

                                return <Cell key={`cell-${index}`} fill={color} stroke="white" strokeWidth={2} />;
                            })}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
