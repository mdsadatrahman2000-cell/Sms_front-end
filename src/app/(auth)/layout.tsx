import { School } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-primary lg:block">
        <div className="flex h-full flex-col items-center justify-center text-primary-foreground">
          <School className="h-16 w-16 mb-4" />
          <h1 className="text-4xl font-bold">School ERP</h1>
          <p className="mt-2 text-lg opacity-80">International-standard School Management Platform</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        {children}
      </div>
    </div>
  )
}
