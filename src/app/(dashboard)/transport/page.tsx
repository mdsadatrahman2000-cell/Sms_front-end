"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus } from "lucide-react"

export default function TransportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transport</h1>
        <p className="text-muted-foreground">Manage routes, vehicles, and student assignments</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" /> Transport Management
          </CardTitle>
          <CardDescription>Routes and vehicle tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Transport module coming soon. Will include route management, vehicle tracking, and student transport assignments.</p>
        </CardContent>
      </Card>
    </div>
  )
}
