"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, MoreHorizontal, Edit, Trash2, Shield, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { rolesApi } from "@/lib/api"

interface Permission {
  id: string
  name: string
  module: string
  description?: string
}

interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean
  _count: {
    users: number
    permissions: number
  }
  permissions?: Permission[]
}

const emptyForm = {
  name: "",
  description: "",
  permissionIds: [] as string[],
}

export default function RolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([])
  const [permissions, setPermissions] = React.useState<Permission[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingRole, setEditingRole] = React.useState<Role | null>(null)
  const [form, setForm] = React.useState(emptyForm)
  const [saving, setSaving] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    const [rolesResult, permsResult] = await Promise.all([
      rolesApi.list(),
      rolesApi.permissions(),
    ])
    if (rolesResult.data) {
      setRoles(rolesResult.data as Role[])
    }
    if (permsResult.data) {
      const permsData = (permsResult.data as any)
      setPermissions(Array.isArray(permsData) ? permsData : permsData.permissions ?? [])
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const groupedPermissions = React.useMemo(() => {
    const groups: Record<string, Permission[]> = {}
    for (const perm of permissions) {
      const mod = perm.module || "Other"
      if (!groups[mod]) groups[mod] = []
      groups[mod].push(perm)
    }
    return groups
  }, [permissions])

  const openCreate = () => {
    setEditingRole(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = async (role: Role) => {
    setEditingRole(role)
    const result = await rolesApi.get(role.id)
    if (result.data) {
      const fullRole = result.data as Role
      setForm({
        name: fullRole.name,
        description: fullRole.description,
        permissionIds: (fullRole.permissions ?? []).map((p) => p.id),
      })
    } else {
      setForm({
        name: role.name,
        description: role.description,
        permissionIds: [],
      })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    if (editingRole) {
      await rolesApi.update(editingRole.id, form)
    } else {
      await rolesApi.create(form)
    }
    setSaving(false)
    setDialogOpen(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      await rolesApi.delete(id)
      fetchData()
    }
  }

  const togglePermission = (permId: string) => {
    setForm((prev) => {
      const ids = prev.permissionIds.includes(permId)
        ? prev.permissionIds.filter((id) => id !== permId)
        : [...prev.permissionIds, permId]
      return { ...prev, permissionIds: ids }
    })
  }

  const toggleModulePermissions = (modulePerms: Permission[]) => {
    const allIds = modulePerms.map((p) => p.id)
    const allSelected = allIds.every((id) => form.permissionIds.includes(id))
    setForm((prev) => {
      let ids = prev.permissionIds.filter((id) => !allIds.includes(id))
      if (!allSelected) {
        ids = [...ids, ...allIds]
      }
      return { ...prev, permissionIds: ids }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Manage user roles and their associated permissions
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      {dialogOpen && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{editingRole ? "Edit Role" : "Create Role"}</CardTitle>
              <CardDescription>
                {editingRole
                  ? "Update the role details and permissions"
                  : "Define a new role with specific permissions"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setDialogOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Administrator"
                  disabled={editingRole?.isSystem}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of this role"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="max-h-80 overflow-y-auto rounded-md border p-4 space-y-4">
                {Object.entries(groupedPermissions).map(([module, perms]) => {
                  const allSelected = perms.every((p) => form.permissionIds.includes(p.id))
                  const someSelected = perms.some((p) => form.permissionIds.includes(p.id))
                  return (
                    <div key={module} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected && !allSelected
                          }}
                          onChange={() => toggleModulePermissions(perms)}
                          className="h-4 w-4 rounded"
                        />
                        <span className="text-sm font-semibold">{module}</span>
                      </div>
                      <div className="ml-6 grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {perms.map((perm) => (
                          <label
                            key={perm.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={form.permissionIds.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="h-3.5 w-3.5 rounded"
                            />
                            <span className="text-muted-foreground">{perm.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {Object.keys(groupedPermissions).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No permissions available
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {form.permissionIds.length} of {permissions.length} permissions selected
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || !form.name}>
                {saving ? "Saving..." : editingRole ? "Update" : "Create"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Role List</CardTitle>
          <CardDescription>All defined roles and their summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>System</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{role.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {role.description || "—"}
                        </span>
                      </TableCell>
                      <TableCell>{role._count.users}</TableCell>
                      <TableCell>{role._count.permissions}</TableCell>
                      <TableCell>
                        {role.isSystem ? (
                          <Badge variant="secondary">System</Badge>
                        ) : (
                          <Badge variant="outline">Custom</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(role)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {!role.isSystem && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(role.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
