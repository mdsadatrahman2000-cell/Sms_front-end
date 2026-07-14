"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { classesApi } from "@/lib/api"

interface Class {
  id: string
  name: string
  gradeLevel?: number
  section?: string
  maxCapacity: number
  classTeacher?: {
    id: string
    firstName: string
    lastName: string
  }
  academicYear: {
    id: string
    name: string
  }
  _count: {
    students: number
  }
}

export default function ClassesPage() {
  const [classes, setClasses] = React.useState<Class[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchClasses = React.useCallback(async () => {
    setLoading(true)
    const result = await classesApi.list()
    if (result.data) {
      setClasses(result.data as Class[])
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      await classesApi.delete(id)
      fetchClasses()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">
            Manage classes and sections
          </p>
        </div>
        <Button asChild>
          <Link href="/classes/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class List</CardTitle>
          <CardDescription>
            A list of all classes in the school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Class Teacher</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Students</TableHead>
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
                ) : classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No classes found
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cls.name}</p>
                          {cls.gradeLevel && (
                            <p className="text-sm text-muted-foreground">
                              Grade {cls.gradeLevel}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{cls.section || "N/A"}</TableCell>
                      <TableCell>
                        {cls.classTeacher
                          ? `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}`
                          : "Not assigned"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{cls.academicYear.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{cls._count.students}/{cls.maxCapacity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/classes/${cls.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/classes/${cls.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(cls.id)}
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
    </div>
  )
}
