"use client"

import * as React from "react"
import { Upload, File, Trash2, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { uploadApi } from "@/lib/api"

interface Document {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  fileSize: number
  category: string
  description?: string
  createdAt: string
}

interface FileUploadProps {
  entityType: string
  entityId: string
  category?: string
  onUploadComplete?: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({ entityType, entityId, category, onUploadComplete }: FileUploadProps) {
  const [documents, setDocuments] = React.useState<Document[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const fetchDocuments = React.useCallback(async () => {
    setLoading(true)
    const result = await uploadApi.list({ entityType, entityId })
    if (result.data) {
      setDocuments(result.data as Document[])
    }
    setLoading(false)
  }, [entityType, entityId])

  React.useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const result = await uploadApi.upload(file, entityType, entityId, category)
    setUploading(false)

    if (result.data) {
      fetchDocuments()
      onUploadComplete?.()
    } else {
      alert(result.error || "Upload failed")
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      await uploadApi.delete(id)
      fetchDocuments()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Files</CardTitle>
            <CardDescription>{documents.length} file(s) uploaded</CardDescription>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading files...</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No files uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-3">
                  <File className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.originalName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>·</span>
                      <Badge variant="outline" className="text-xs">
                        {doc.category}
                      </Badge>
                      <span>·</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={uploadApi.download(doc.id)} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
