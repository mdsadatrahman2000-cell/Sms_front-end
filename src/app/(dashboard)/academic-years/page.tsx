"use client"

import * as React from "react"
import { Plus, MoreHorizontal, Edit, Trash2, Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { academicYearsApi } from "@/lib/api"

interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
  _count: {
    classes: number
  }
}

const emptyForm = {
  name: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
}

export default function AcademicYearsPage() {
  const [years, setYears] = React.useState<AcademicYear[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingYear, setEditingYear] = React.useState<AcademicYear | null>(null)
  const [form, setForm] = React.useState(emptyForm)
  const [saving, setSaving] = React.useState(false)

  const fetchYears = React.useCallback(async () => {
    setLoading(true)
    const result = await academicYearsApi.list()
    if (result.data) {
      setYears(result.data as AcademicYear[])
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    fetchYears()
  }, [fetchYears])

  const openCreate = () => {
    setEditingYear(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (year: AcademicYear) => {
    setEditingYear(year)
    setForm({
      name: year.name,
      startDate: year.startDate.split("T")[0],
      endDate: year.endDate.split("T")[0],
      isCurrent: year.isCurrent,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    if (editingYear) {
      await academicYearsApi.update(editingYear.id, form)
    } else {
      await academicYearsApi.create(form)
    }
    setSaving(false)
    setDialogOpen(false)
    fetchYears()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this academic year?")) {
      await academicYearsApi.delete(id)
      fetchYears()
    }
  }

  const handleSetCurrent = async (id: string) => {
    await academicYearsApi.setCurrent(id)
    fetchYears()
  }

  const totalClasses = years.reduce((acc, y) => acc + y._count.classes, 0)
  const currentYear = years.find((y) => y.isCurrent)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Years</h1>
          <p className="text-muted-foreground">
            Manage academic years and their configurations
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Academic Year
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Years</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{years.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Year</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentYear ? currentYear.name : "None"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Year List</CardTitle>
          <CardDescription>
            All registered academic years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : years.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No academic years found
                    </TableCell>
                  </TableRow>
                ) : (
                  years.map((year) => (
                    <TableRow key={year.id}>
                      <TableCell>
                        <p className="font-medium">{year.name}</p>
                      </TableCell>
                      <TableCell>
                        {new Date(year.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(year.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {year.isCurrent ? (
                          <Badge variant="default">
                            <Check className="mr-1 h-3 w-3" />
                            Current
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Past</Badge>
                        )}
                      </TableCell>
                      <TableCell>{year._count.classes}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!year.isCurrent && (
                              <DropdownMenuItem onClick={() => handleSetCurrent(year.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Set Current
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => openEdit(year)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(year.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              {editingYear ? "Edit Academic Year" : "Create Academic Year"}
            </h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. 2024-2025"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isCurrent"
                  type="checkbox"
                  checked={form.isCurrent}
                  onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isCurrent" className="cursor-pointer">
                  Set as current academic year
                </Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || !form.name || !form.startDate || !form.endDate}>
                {saving ? "Saving..." : editingYear ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
