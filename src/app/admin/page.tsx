"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store"
import AdminDashboard from "@/components/admin/dashboard"
import AdminLogin from "@/components/admin/login"

export default function AdminPage() {
  const { user, isAuthenticated } = useStore()
  const router = useRouter()

  useEffect(() => {
    // If user is authenticated but not an admin, redirect to home
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <AdminLogin />
  }

  // If authenticated as admin, show dashboard
  if (user?.role === "admin") {
    return <AdminDashboard />
  }

  // Loading state
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
      <p>Loading...</p>
    </div>
  )
}
