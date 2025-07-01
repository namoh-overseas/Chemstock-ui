"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSellerProducts } from "@/app/api/user/getSellerProducts";
import ProductCard from "./product-card";
import { cn } from "@/lib/utils";
import { useSize } from "@/hooks/use-mobile";

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  currency: "INR" | "USD";
  stock: number;
  description: string;
  tone: string;
  ci: string;
  stockUnit: "kg" | "grm" | "mg" | "ml" | "ltr" | "pcs" | "mts";
  image: string;
  seller: {
    id: string;
    username: string;
    company: string;
  };
  isFeatured: boolean;
}


interface Data {
  count: number;
  usdToInrRate: number;
  totalProducts: number;
  products: ProductItem[];
  page: number;
  limit: number;
  totalPages: number;
}

export default function SellerProducts({
  sellerId,
  productId,
}: {
  sellerId: string;
  productId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data | null>(null);

  const pageParam = 1;
  const limitParam = 25;

  const fetchProducts = async (page = pageParam, limit = limitParam) => {
    setLoading(true);
    try {
      const response = await getSellerProducts(
        sellerId,
        productId,
        page,
        limit
      );
      if (response) {
        setData(response as Data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(pageParam, limitParam);
  }, [pageParam, limitParam]);
  const products = data?.products ?? [];

  const size = useSize();

  if (products.length === 0) {
    return <div></div>;
  }
  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
          More Stocks from <span className="font-semibold text-gray-400">{data?.products[0].seller.company}</span>
        </h2>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : (
        <div className={cn("grid gap-6", 
        size === "xs" && "grid-cols-1",
        size === "sm" && "grid-cols-2",
        size === "md" && "grid-cols-2",
        size === "lg" && "grid-cols-3",
        size === "xl" && "grid-cols-4")}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              usdToInrRate={data?.usdToInrRate || 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
