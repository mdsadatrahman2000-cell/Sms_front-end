"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"]

export function AttendanceBarChart({ data }: { data: { label: string; present: number; absent: number }[] }) {
  if (!data.length) return <p className="text-center text-muted-foreground py-4">No data</p>
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Bar dataKey="present" fill="#22c55e" name="Present" />
        <Bar dataKey="absent" fill="#ef4444" name="Absent" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AttendancePieChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <p className="text-center text-muted-foreground py-4">No data</p>
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }: any) => `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
