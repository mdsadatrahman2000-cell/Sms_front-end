"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">Manage school supplies and stock</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" /> Inventory Management
          </CardTitle>
          <CardDescription>Stock tracking and procurement</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Inventory module coming soon. Will include item catalog, stock movements, and low-stock alerts.</p>
        </CardContent>
      </Card>
    </div>
  )
}
