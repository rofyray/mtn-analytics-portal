"use client"

import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart as RechartsLine,
  Line,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Color palette for charts
const COLORS = {
  pending: "#FFCA06", // MTN Y'ello
  assigned: "#3b82f6", // blue
  completed: "#10b981", // green
  primary: "#014d6d",
  secondary: "#9775fa",
  tertiary: "#ffca06",
}

// Pie Chart Component
interface PieChartProps {
  title: string
  description?: string
  data: Array<{ name: string; value: number }>
}

export function PieChartCard({ title, description, data }: PieChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                const percentValue = (percent || 0) * 100
                if (percentValue === 0) return null
                return `${name}: ${percentValue.toFixed(0)}%`
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => {
                const colorKey = entry.name.toLowerCase() as keyof typeof COLORS
                const color = COLORS[colorKey] || COLORS.primary
                return <Cell key={`cell-${index}`} fill={color} />
              })}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Line Chart Component
interface LineChartProps {
  title: string
  description?: string
  data: Array<{ date: string; value: number }>
  dataKey?: string
}

export function LineChartCard({ title, description, data, dataKey = "value" }: LineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLine data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={COLORS.primary}
              strokeWidth={2}
              dot={{ fill: COLORS.primary }}
            />
          </RechartsLine>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Bar Chart Component
interface BarChartProps {
  title: string
  description?: string
  data: Array<{ name: string; value: number }>
  dataKey?: string
}

export function BarChartCard({ title, description, data, dataKey = "value" }: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBar data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey={dataKey} fill={COLORS.primary} radius={[8, 8, 0, 0]} />
          </RechartsBar>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
