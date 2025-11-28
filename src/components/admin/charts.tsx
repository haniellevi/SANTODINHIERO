"use client"

import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart as RLineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'

type Point = { label: string; value: number }

function sum(values: number[]) {
  return values.reduce((a, b) => a + b, 0)
}

function average(values: number[]) {
  if (values.length === 0) return 0
  return sum(values) / values.length
}

function StatsLegend({ data, prefix = '', suffix = '' }: { data: Point[]; prefix?: string; suffix?: string }) {
  const last = data.at(-1)?.value ?? 0
  const avg = average(data.map(d => d.value))
  const total = sum(data.map(d => d.value))

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[10px] sm:text-xs mb-2">
      <div className="flex items-center gap-1">
        <span className="inline-block size-2 rounded-full bg-primary" />
        <span className="text-muted-foreground">Latest:</span>
        <span className="font-medium text-foreground">{prefix}{last.toFixed(0)}{suffix}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block size-2 rounded-full bg-foreground/40" />
        <span className="text-muted-foreground">Avg:</span>
        <span className="font-medium text-foreground">{prefix}{avg.toFixed(0)}{suffix}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block size-2 rounded-full bg-foreground/20" />
        <span className="text-muted-foreground">Total:</span>
        <span className="font-medium text-foreground">{prefix}{total.toFixed(0)}{suffix}</span>
      </div>
    </div>
  )
}

function ValueTooltip({ active, payload, label, prefix = '', suffix = '' }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (active && payload && payload.length) {
    const val = payload[0].value as number
    return (
      <div className="rounded-md border border-border bg-popover px-2 py-1 text-xs text-foreground shadow-sm">
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground">{prefix}{val.toFixed(0)}{suffix}</div>
      </div>
    )
  }
  return null
}

export function MrrBarChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} margin={{ top: 20, right: 12, left: 0, bottom: 0 }} barCategoryGap={18}>
          <defs>
            <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
          <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} content={<ValueTooltip prefix="$" />} />
          <Legend verticalAlign="top" align="right" content={<StatsLegend data={data} prefix="$" />} wrapperStyle={{ paddingBottom: '20px' }} />
          <Bar dataKey="value" fill="url(#mrrGradient)" radius={[4, 4, 0, 0]} />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ArrBarChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} margin={{ top: 20, right: 12, left: 0, bottom: 0 }} barCategoryGap={18}>
          <defs>
            <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
          <YAxis tickLine={false} axisLine={false} width={45} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} content={<ValueTooltip prefix="$" />} />
          <Legend verticalAlign="top" align="right" content={<StatsLegend data={data} prefix="$" />} wrapperStyle={{ paddingBottom: '20px' }} />
          <Bar dataKey="value" fill="url(#arrGradient)" radius={[4, 4, 0, 0]} />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ChurnLineChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="churnStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
          <YAxis tickLine={false} axisLine={false} width={40} domain={[0, 'auto']} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }} content={<ValueTooltip suffix="%" />} />
          <Legend verticalAlign="top" align="right" content={<StatsLegend data={data} suffix="%" />} wrapperStyle={{ paddingBottom: '20px' }} />
          <Line type="monotone" dataKey="value" stroke="url(#churnStroke)" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))', fill: 'hsl(var(--primary))' }} activeDot={{ r: 6, strokeWidth: 0 }} />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  )
}
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#ff4d4d"];
export function ExpenseDistributionPieChart({ data }: { data: { name: string; value: number }[] }) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }