"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { libraryApi } from "@/lib/api"
import { Plus, BookOpen, CheckCircle, AlertCircle } from "lucide-react"

export default function LibraryPage() {
  const [books, setBooks] = React.useState<any[]>([])
  const [issued, setIssued] = React.useState<any[]>([])
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    Promise.all([libraryApi.list(), libraryApi.issued()]).then(([booksRes, issuedRes]) => {
      if (booksRes.data) setBooks((booksRes.data as any).books || [])
      if (issuedRes.data) setIssued(issuedRes.data as any[])
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Library</h1>
          <p className="text-muted-foreground">Manage books, issues, and returns</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Book</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{books.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Issued</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{issued.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Catalog</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.title}</TableCell>
                  <TableCell>{b.author}</TableCell>
                  <TableCell className="font-mono text-sm">{b.isbn || "-"}</TableCell>
                  <TableCell>{b.category || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={b.available > 0 ? "default" : "destructive"}>
                      {b.available}/{b.quantity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {books.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No books found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
