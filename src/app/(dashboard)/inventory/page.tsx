"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { inventoryApi } from "@/lib/api"
import Link from "next/link"
import { Plus, Package, AlertTriangle, Pencil, Trash2 } from "lucide-react"

export default function InventoryPage() {
  const [items, setItems] = React.useState<any[]>([])
  const [lowStock, setLowStock] = React.useState<any[]>([])
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  const fetchItems = React.useCallback(() => {
    Promise.all([inventoryApi.list(), inventoryApi.lowStock()]).then(([itemsRes, lowRes]) => {
      if (itemsRes.data) setItems((itemsRes.data as any).items || [])
      if (lowRes.data) setLowStock(lowRes.data as any[])
      setLoading(false)
    })
  }, [])

  React.useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return
    await inventoryApi.delete(id)
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage school supplies and stock</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{items.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{lowStock.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Inventory Items</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unitPrice ? `$${item.unitPrice}` : "-"}</TableCell>
                  <TableCell>{item.location || "-"}</TableCell>
                  <TableCell>
                    {item.quantity <= item.minStock ? (
                      <Badge variant="destructive">Low Stock</Badge>
                    ) : (
                      <Badge variant="default">In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/inventory/${item.id}/edit`}>
                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && !loading && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No items found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
