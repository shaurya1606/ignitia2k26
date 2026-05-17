'use client'

import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { Card, CardTitle } from '@/components/atomquest/page-shell'

const CHART_COLORS = ['#34d399', '#fbbf24', '#94a3b8', '#f87171']

type AdminChartsProps = {
    submitPct: number
    approvalPct: number
    achievementData: { name: string; value: number }[]
    managerData: { name: string; approved: number; pending: number }[]
}

export function AdminCharts({
    submitPct,
    approvalPct,
    achievementData,
    managerData,
}: AdminChartsProps) {
    const progressData = [
        { name: 'Submitted', value: submitPct },
        { name: 'Approved', value: approvalPct },
        { name: 'Remaining', value: Math.max(0, 100 - submitPct) },
    ]

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <Card>
                <CardTitle>Submission progress</CardTitle>
                <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={progressData} layout="vertical" margin={{ left: 8 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={72}
                                tick={{ fill: '#a3a3a3', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0a0a0a',
                                    border: '1px solid #404040',
                                    borderRadius: 8,
                                }}
                                formatter={(v) => [`${Number(v ?? 0)}%`, '']}
                            />
                            <Bar dataKey="value" radius={4}>
                                {progressData.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={
                                            i === 0
                                                ? '#fbbf24'
                                                : i === 1
                                                  ? '#34d399'
                                                  : '#404040'
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card>
                <CardTitle>Achievement mix</CardTitle>
                <div className="h-52">
                    {achievementData.length === 0 ? (
                        <p className="text-sm text-neutral-500 text-center pt-16">
                            No check-in data yet
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={achievementData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                >
                                    {achievementData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#0a0a0a',
                                        border: '1px solid #404040',
                                        borderRadius: 8,
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            <Card>
                <CardTitle>Manager completion</CardTitle>
                <div className="h-52">
                    {managerData.length === 0 ? (
                        <p className="text-sm text-neutral-500 text-center pt-16">
                            No managers in directory
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={managerData} margin={{ bottom: 8 }}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#a3a3a3', fontSize: 11 }}
                                    interval={0}
                                    angle={-20}
                                    textAnchor="end"
                                    height={48}
                                />
                                <YAxis allowDecimals={false} tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#0a0a0a',
                                        border: '1px solid #404040',
                                        borderRadius: 8,
                                    }}
                                />
                                <Bar dataKey="approved" stackId="a" fill="#34d399" name="Approved" />
                                <Bar dataKey="pending" stackId="a" fill="#fbbf24" name="Pending" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>
        </div>
    )
}