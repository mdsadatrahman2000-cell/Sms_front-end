"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { timetableApi, classesApi } from "@/lib/api"
import { Calendar, Plus, Trash2 } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00",
]

export default function TimetablePage() {
  const [classes, setClasses] = React.useState<any[]>([])
  const [selectedClass, setSelectedClass] = React.useState("")
  const [slots, setSlots] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    classesApi.list().then((res) => {
      if (res.data) setClasses(Array.isArray(res.data) ? res.data : (res.data as any).classes || [])
    })
  }, [])

  React.useEffect(() => {
    if (selectedClass) {
      setLoading(true)
      timetableApi.getByClass(selectedClass).then((res) => {
        if (res.data) setSlots(res.data as any[])
        setLoading(false)
      })
    }
  }, [selectedClass])

  const getSlot = (day: number, time: string) => {
    return slots.find((s) => s.dayOfWeek === day && s.startTime === time)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">Manage class schedules and teacher timetables</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Class Timetable
          </CardTitle>
          <CardDescription>Select a class to view its weekly timetable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-64"><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>
                {classes.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClass && !loading && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left text-sm font-medium bg-muted">Time</th>
                    {DAYS.map((day, i) => (
                      <th key={i} className="border p-2 text-left text-sm font-medium bg-muted">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((time) => (
                    <tr key={time}>
                      <td className="border p-2 text-sm font-mono">{time}</td>
                      {DAYS.map((_, dayIndex) => {
                        const slot = getSlot(dayIndex, time)
                        return (
                          <td key={dayIndex} className="border p-2">
                            {slot ? (
                              <div className="bg-primary/10 rounded p-1 text-xs">
                                <div className="font-medium">{slot.subject?.name}</div>
                                <div className="text-muted-foreground">{slot.teacher?.firstName} {slot.teacher?.lastName}</div>
                                {slot.room && <div className="text-muted-foreground">Room: {slot.room}</div>}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!selectedClass && (
            <div className="text-center py-8 text-muted-foreground">
              Select a class to view its timetable
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
