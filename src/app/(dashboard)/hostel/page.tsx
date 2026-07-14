"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building } from "lucide-react"

export default function HostelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hostel</h1>
        <p className="text-muted-foreground">Manage hostels, rooms, and student assignments</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" /> Hostel Management
          </CardTitle>
          <CardDescription>Room allocation and tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Hostel module coming soon. Will include hostel management, room allocation, and occupancy tracking.</p>
        </CardContent>
      </Card>
    </div>
  )
}
