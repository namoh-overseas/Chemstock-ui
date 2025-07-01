"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store"
import SellerDashboard from "@/components/seller/dashboard"
import SellerLogin from "@/components/seller/login"

export default function SellerPage() {
  const { user, isAuthenticated } = useStore()
  const router = useRouter()

  useEffect(() => {
    // If user is authenticated but not a seller, redirect to home
    if (isAuthenticated && user?.role !== "seller") {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // If not authenticated, show login
  if (!isAuthenticated ) {
    return <SellerLogin />
  }

  // If authenticated as seller, show dashboard
  if (user?.role === "seller") {
    return <SellerDashboard />
  }

  // Loading state
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
      <p>Loading...</p>
    </div>
  )
}
