"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Library</h1>
        <p className="text-muted-foreground">Manage books, issues, and returns</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Library Management
          </CardTitle>
          <CardDescription>Book catalog and issue tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Library module coming soon. Will include book catalog, issue/return tracking, and fine management.</p>
        </CardContent>
      </Card>
    </div>
  )
}
