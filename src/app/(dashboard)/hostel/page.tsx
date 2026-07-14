"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { hostelApi } from "@/lib/api"
import { Plus, Building, Bed, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

export default function HostelPage() {
  const [hostels, setHostels] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    hostelApi.list().then((res) => {
      if (res.data) setHostels(res.data as any[])
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) return
    const res = await hostelApi.delete(id)
    if (!res.error) {
      setHostels((prev) => prev.filter((h) => h.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hostel</h1>
          <p className="text-muted-foreground">Manage hostels, rooms, and student assignments</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Hostel</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{hostels.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Hostels</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Warden</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hostels.map((h: any) => (
                <TableRow key={h.id}>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell>{h.address || "-"}</TableCell>
                  <TableCell>{h.capacity}</TableCell>
                  <TableCell><Badge variant="outline"><Bed className="h-3 w-3 mr-1" /> {h._count?.rooms || 0}</Badge></TableCell>
                  <TableCell>{h.wardenName || "-"}</TableCell>
                  <TableCell><Badge variant={h.isActive ? "default" : "secondary"}>{h.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Link href={`/hostel/${h.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(h.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {hostels.length === 0 && !loading && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No hostels found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
