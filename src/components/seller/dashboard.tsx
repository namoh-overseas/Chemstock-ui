"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import SellerProducts from "@/components/seller/products"
import SellerOrders from "@/components/seller/orders"
import { useStore } from "@/store"
import Analytics from "./analytics"
import SellerInfo from "./info"
import SellerRequests from "./requests"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function SellerDashboard() {
  
  const { logout } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const handleLogout = () => {
    confirm("Are you sure you want to logout?") && logout();
  };

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab) {
      router.push(`${pathname}?tab=${tab}`);
    } else {
      router.push(`${pathname}?tab=overview`);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <div className="flex gap-2">
        <Button asChild>
          <Link href="/seller/add-product">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="cursor-pointer"
        >
          Logout
        </Button>
        </div>
      </div>

      <Tabs 
      defaultValue="overview"
      value={searchParams?.get("tab") || "overview"}
      onValueChange={(value) => router.push(`${pathname}?tab=${value}`)}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Analytics /> 
          <SellerInfo />
        </TabsContent>

        <TabsContent value="products">
          <SellerProducts />
        </TabsContent>

        <TabsContent value="orders">
          <SellerOrders />
        </TabsContent>

        <TabsContent value="requests">
          <SellerRequests />
        </TabsContent>
      </Tabs>
    </div>
  )
}

