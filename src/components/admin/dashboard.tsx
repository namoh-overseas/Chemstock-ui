"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SellerManagement from "@/components/admin/seller-management";
import ProductManagement from "@/components/admin/product-management";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import Requests from "./requests";
import SellerOrders from "./orders";
import Info from "./info";
import { getAnalytics } from "@/app/api/admin/analytics";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Analytics from "./analytics";

interface Analytics {
  unverifiedUsers: number;
  unverifiedProducts: number;
  unverifiedRequests: number;
  totalUsers: number;
  totalProducts: number;
  totalRequests: number;
  totalOrders: number;
  completedOrders: number;
  completedRequests: number;
  totalRevenue: number;
  thisMonthUsers: number;
  thisMonthProducts: number;
  thisMonthRequests: number;
  thisMonthOrders: number;
  thisMonthRevenue: number;
  thisMonthUsersPercentage: number;
  thisMonthProductsPercentage: number;
  thisMonthRequestsPercentage: number;
  thisMonthOrdersPercentage: number;
  thisMonthRevenuePercentage: number;
  thisMonthCompletedOrders: number;
  thisMonthCompletedRequests: number;
  thisMonthCancelledOrders: number;
  thisMonthCancelledRequests: number;
  cancelledOrders: number;
  cancelledRequests: number;
  completedOrdersPercentage: number;
  completedRequestsPercentage: number;
  cancelledOrdersPercentage: number;
  cancelledRequestsPercentage: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | any>(null);
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
    const fetchAnalytics = async () => {
      const response = await getAnalytics();
      if (response) {
        setAnalytics(response?.analytics);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs
        defaultValue="overview"
        value={searchParams?.get("tab") || "overview"}
        onValueChange={(value) => router.push(`${pathname}?tab=${value}`)}
      >
        <div className="flex justify-between items-center mb-8">
          <TabsList className="">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger
              title={`${analytics?.unverifiedProducts} ${
                analytics?.unverifiedProducts > 1
                  ? "Products are"
                  : "Product is"
              }  not Verified Yet.`}
              value="products"
            >
              Products{" "}
              <span className="size-5 bg-red-200 text-red-700 border text-[9.8px] relative -top-3 -left-1 leading-[1.3rem] text-center border-red-700 rounded-full">
                {analytics?.unverifiedProducts > 99
                  ? "+99"
                  : analytics?.unverifiedProducts}
              </span>
            </TabsTrigger>
            <TabsTrigger
              title={`${analytics?.unverifiedUsers} ${
                analytics?.unverifiedUsers > 1 ? "Users are" : "User is"
              }  not Verified Yet.`}
              value="sellers"
            >
              Sellers{" "}
              <span className="size-5 bg-blue-200 text-blue-700 border text-[9.8px] relative -top-3 -left-1 leading-[1.3rem] text-center border-blue-700 rounded-full">
                {analytics?.unverifiedUsers}
              </span>
            </TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger
              title={`${analytics?.unverifiedRequests} ${
                analytics?.unverifiedRequests > 1
                  ? "Requests are"
                  : "Request is"
              }  not Verified Yet.`}
              value="requests"
            >
              Requests{" "}
              <span className="size-5 bg-amber-200 text-amber-700 border text-[9.8px] relative -top-3 -left-1 leading-[1.3rem] text-center border-amber-700 rounded-full">
                {analytics?.unverifiedRequests}
              </span>
            </TabsTrigger>
          </TabsList>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="cursor-pointer"
          >
            Logout
          </Button>
        </div>


        <TabsContent value="overview">
          <Analytics analytics={analytics} />
          <Info />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="sellers">
          <SellerManagement />
        </TabsContent>

        <TabsContent value="orders">
          <SellerOrders />
        </TabsContent>

        <TabsContent value="requests">
          <Requests />
        </TabsContent>
      </Tabs>
    </div>
  );
}
