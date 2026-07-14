"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<"profile" | "academic" | "notifications" | "security">("profile")
  const [saved, setSaved] = React.useState(false)

  const [profile, setProfile] = React.useState({
    schoolName: "Springfield Academy",
    email: "admin@springfield.edu",
    phone: "+1 (555) 123-4567",
    address: "123 Education Lane, Springfield, IL 62701",
    website: "https://springfield.edu",
  })

  const [academic, setAcademic] = React.useState({
    currentYear: "2025-2026",
    timezone: "America/Chicago",
    language: "en",
  })

  const [notifications, setNotifications] = React.useState({
    emailNotifications: true,
    studentUpdates: true,
    attendanceAlerts: true,
    gradePublishing: false,
  })

  const [passwords, setPasswords] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const tabs = [
    { key: "profile" as const, label: "School Profile" },
    { key: "academic" as const, label: "Academic" },
    { key: "notifications" as const, label: "Notifications" },
    { key: "security" as const, label: "Security" },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your school configuration and preferences
        </p>
      </div>

      <div className="flex gap-2 border-b pb-px">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>School Profile</CardTitle>
            <CardDescription>
              Basic information about your school that appears across the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={profile.schoolName}
                  onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "academic" && (
        <Card>
          <CardHeader>
            <CardTitle>Academic Settings</CardTitle>
            <CardDescription>
              Configure academic year, timezone, and language preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Current Academic Year</Label>
                <Input value={academic.currentYear} disabled />
                <p className="text-xs text-muted-foreground">
                  To change the academic year, go to Academic Years page
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={academic.timezone}
                  onChange={(e) => setAcademic({ ...academic, timezone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={academic.language}
                  onChange={(e) => setAcademic({ ...academic, language: e.target.value })}
                  placeholder="e.g. en, fr, es"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Control which notifications are sent via email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { key: "emailNotifications" as const, label: "Email Notifications", desc: "Enable or disable all email notifications" },
                { key: "studentUpdates" as const, label: "Student Updates", desc: "Get notified about student record changes" },
                { key: "attendanceAlerts" as const, label: "Attendance Alerts", desc: "Receive alerts for absent students" },
                { key: "gradePublishing" as const, label: "Grade Publishing", desc: "Notify parents when grades are published" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNotifications({ ...notifications, [item.key]: !notifications[item.key] })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      notifications[item.key] ? "bg-primary" : "bg-input"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                        notifications[item.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                />
                {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={
                  !passwords.currentPassword ||
                  !passwords.newPassword ||
                  passwords.newPassword !== passwords.confirmPassword
                }
              >
                {saved ? "Saved!" : "Update Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
