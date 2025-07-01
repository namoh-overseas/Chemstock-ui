"use client"
import { getAnalytics } from "@/app/api/seller/getAnalyticts"
import { useEffect, useState } from "react"
import { useStore } from "@/store"
interface Analytics {
  usdToInrRate: number;
  productsAnalytics: {
    totalSales: number;
    totalProducts: number;
    totalRevenue: number;
    totalStock: number;
    totalStockValue: number;
    addedThisMonth: number;
    activeProducts: number;
    inactiveProducts: number;
  };
  orderAnalytics: {
    lastMonthOrders: number;
    totalOrders: number;
    totalRevenue: number;
  };
}

export default function Analytics() {
  const { currency } = useStore();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await getAnalytics();
      if ((response as any).isVerified === false) {
        setIsVerified(false)
      }
      else if (response) {
        setAnalytics(response as Analytics);
        setIsVerified(true)
      }
    };
    fetchAnalytics();
  }, []);

  if (!isVerified) {
    return <div className="text-red-500">You are not verified yet, Once verified by Admin you will be able to view your analytics and list stocks</div>;
  }
  return (
    <div className="flex items-center justify-center text-gray-800 p-10">

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 w-full max-w-6xl">


        <div className="flex items-center p-4 rounded border border-gray-200 bg-slate-100">
          <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
            <svg className="w-6 h-6 fill-current text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">Total Products</span>

            <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{analytics?.productsAnalytics.totalProducts}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{"+" + (analytics?.productsAnalytics?.addedThisMonth || 0) + " this month"}</span>
              <span className="text-green-500 text-sm font-semibold ml-2">+{isNaN((analytics?.productsAnalytics?.addedThisMonth || 0) / (analytics?.productsAnalytics?.totalProducts || 0) * 100) ? "0" : ((analytics?.productsAnalytics?.addedThisMonth || 0) / (analytics?.productsAnalytics?.totalProducts || 0) * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 rounded border border-gray-200 bg-slate-100">
          <div className="flex flex-shrink-0 items-center justify-center bg-red-200 h-16 w-16 rounded">
            <svg className="w-6 h-6 fill-current text-red-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fillRule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">Inactive Products</span>
            <span className="text-xl  font-semibold text-indigo-600 dark:text-indigo-400">{analytics?.productsAnalytics.inactiveProducts}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">of total products</span>
              <span className="text-red-500 text-sm font-semibold ml-2">{analytics?.productsAnalytics.inactiveProducts ? (analytics?.productsAnalytics.inactiveProducts / analytics?.productsAnalytics.totalProducts * 100) + "%" : "0%"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 rounded border border-gray-200 bg-slate-100">
          <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
            <svg className="w-6 h-6 fill-current text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">Active Products</span>

            <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{analytics?.productsAnalytics.activeProducts}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">of total products</span>
              <span className="text-green-500 text-sm font-semibold ml-2">+{isNaN((analytics?.productsAnalytics.activeProducts as number) / (analytics?.productsAnalytics.totalProducts as number) * 100) ? "0" : ((analytics?.productsAnalytics.activeProducts as number) / (analytics?.productsAnalytics.totalProducts as number) * 100)}%</span>
            </div>
          </div>
        </div>


        <div className="flex items-center p-4 rounded border border-gray-200 bg-slate-100">
          <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
            <svg className="w-6 h-6 fill-current text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">Total Orders</span>

            <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{analytics?.orderAnalytics.totalOrders}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{"+" + (analytics?.orderAnalytics?.lastMonthOrders || 0) + " this month"}</span>
              <span className="text-green-500 text-sm font-semibold ml-2">+{isNaN((analytics?.orderAnalytics.lastMonthOrders as number) / (analytics?.orderAnalytics.totalOrders as number) * 100) ? "0" : ((analytics?.orderAnalytics.lastMonthOrders as number) / (analytics?.orderAnalytics.totalOrders as number) * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 rounded border border-gray-200 bg-slate-100">
          <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
            <svg className="w-6 h-6 fill-current text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">Total Revenue</span>

            <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{(currency === "USD" ? "$" : "₹") + (analytics?.productsAnalytics.totalRevenue ? (analytics?.productsAnalytics.totalRevenue * (currency === "USD" ? analytics?.usdToInrRate : 1)).toFixed(2) : "0")}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500"></span>
              <span className="text-green-500 text-sm font-semibold ml-2"></span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 rounded border border-gray-200 bg-slate-100">
          <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
            <svg className="w-6 h-6 fill-current text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">Total Stock</span>

            <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{analytics?.productsAnalytics.totalStock}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500"></span>
              <span className="text-green-500 text-sm font-semibold ml-2"></span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
