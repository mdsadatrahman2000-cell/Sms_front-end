"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { transportApi } from "@/lib/api"
import { Plus, Bus, Users } from "lucide-react"

export default function TransportPage() {
  const [routes, setRoutes] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    transportApi.routes().then((res) => {
      if (res.data) setRoutes(res.data as any[])
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport</h1>
          <p className="text-muted-foreground">Manage routes, vehicles, and student assignments</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Route</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Bus className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{routes.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Routes</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route Name</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Stops</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Monthly Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.vehicleNumber || "-"}</TableCell>
                  <TableCell>{r.driverName || "-"} {r.driverPhone ? `(${r.driverPhone})` : ""}</TableCell>
                  <TableCell>{r.stops?.length || 0} stops</TableCell>
                  <TableCell><Badge variant="outline"><Users className="h-3 w-3 mr-1" /> {r._count?.students || 0}</Badge></TableCell>
                  <TableCell>{r.monthlyFee ? `$${r.monthlyFee}` : "-"}</TableCell>
                </TableRow>
              ))}
              {routes.length === 0 && !loading && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No routes found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
