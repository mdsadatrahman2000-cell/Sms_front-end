"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { feesApi } from "@/lib/api"
import { DollarSign, Plus, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import Link from "next/link"

export default function FeesPage() {
  const [invoices, setInvoices] = React.useState<any[]>([])
  const [revenue, setRevenue] = React.useState<{ collected: number; pending: number }>({ collected: 0, pending: 0 })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    Promise.all([feesApi.invoices(), feesApi.revenue()]).then(([invRes, revRes]) => {
      if (invRes.data) setInvoices(invRes.data as any[])
      if (revRes.data) setRevenue(revRes.data as { collected: number; pending: number })
      setLoading(false)
    })
  }, [])

  const statusBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>
      case "partial": return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" /> Partial</Badge>
      default: return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Unpaid</Badge>
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return
    const res = await feesApi.deleteInvoice(id)
    if (!res.error) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
          <p className="text-muted-foreground">Manage invoices, payments, and revenue</p>
        </div>
        <Link href="/fees/new"><Button><Plus className="h-4 w-4 mr-2" /> Create Invoice</Button></Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${revenue.collected.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${revenue.pending.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Fee Structure</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv: any) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-sm">{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.student?.user?.firstName} {inv.student?.user?.lastName}</TableCell>
                  <TableCell>{inv.feeStructure?.name}</TableCell>
                  <TableCell>${Number(inv.totalAmount).toLocaleString()}</TableCell>
                  <TableCell>${Number(inv.paidAmount).toLocaleString()}</TableCell>
                  <TableCell>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>{statusBadge(inv.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
