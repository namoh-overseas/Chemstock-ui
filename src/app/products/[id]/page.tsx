"use client";
import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductRatings from "@/components/product-ratings";
import { Rating } from "@/components/product-ratings";
import Link from "next/link";
import FallbackImage from "@/lib/imgLoader";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useParams } from "next/navigation";
import { getProduct } from "@/app/api/user/getProducts";
import { useStore } from "@/store";
import SellerProducts from "@/components/seller-products";
import MoreProducts from "@/components/more-products";
import { User } from "lucide-react";

export interface Product {
  product: {
    name: string;
    price: number;
    currency: "INR" | "USD";
    description: string;
    stock: number;
    stockUnit: "kg" | "grm" | "mg" | "ml" | "ltr" | "pcs" | "mts";
    image: string;
  };
  ratingCount: number;
  ratingSum: number;
  ratingAverage: number;
  ratings: [
    {
      name: string;
      email: string;
      rating: number;
      comment: string;
      createdAt: string;
    } | null
  ];
  usdToInrRate: number;
  sellerId: string;
  sellerName: string;
  sellerCompany: string;
}
export default function ProductDetailPage() {
  const { currency, switchCurrency } = useStore();
  const [data, setData] = useState<Product | null>(null);
  const id = useParams().id as string;
  const [isMounted, setIsMounted] = useState(false);

  const getProductData = async () => {
    const product = await getProduct(id);
    if (product) {
      setData(product);
    }
  }
  useEffect(() => {
    setIsMounted(true);
    getProductData();
  }, [])

  if (!isMounted) return null;
  
  if (!data || !data?.product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p>Product not found</p>
        </div>
      </div>
    );
  }
  else if(data?.product){
    return <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative h-[400px] p-2 rounded-lg overflow-hidden">
          <FallbackImage
            src={data?.product?.image || "/placeholder.svg"}
            alt={data?.product?.name || ""}
            width={400}
            height={400}
            className="object-cover size-full"
            priority
            loading="eager"
          />
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{data?.product.name}</h1>
            <div className="flex items-center justify-between mb-4 w-64 border-gray-800 rounded-lg p-2">
              <div className="">
                {currency == "INR" ? "₹" : "$"} <span className="text-2xl font-bold">
                  {(data?.product.currency === "INR" && currency === "INR") || (data?.product.currency === "USD" && currency === "USD")
                    ? data?.product.price
                    :
                    data?.product.currency === "INR" && currency !== "INR"
                      ? (data?.product.price / data?.usdToInrRate).toFixed(2)
                      :
                      data?.product.currency === "USD" && currency !== "USD"
                        ? Math.round(data?.product.price * data?.usdToInrRate)
                        : 0
                  }
                </span>
                <span className="ml-2 text-sm text-gray-500 capitalize">
                  / {data?.product.stockUnit}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span
                  className={`text-xl transition-all duration-300 ease-in-out ${currency === "INR"
                    ? "font-bold text-primary"
                    : "font-normal text-gray-400"
                    }`}
                >
                  ₹
                </span>
                <Switch
                  className=""
                  defaultChecked={currency === "INR"}
                  checked={currency !== "INR"}
                  onClick={() =>
                    switchCurrency(
                      currency === "INR" ? "USD" : "INR"
                    )
                  }
                />
                <span
                  className={`text-xl transition-all duration-300 ease-in-out ${currency !== "INR"
                    ? "font-bold text-primary"
                    : "font-normal text-gray-400"
                    }`}
                >
                  $
                </span>
              </div>
            </div>
            <pre className="text-gray-700 mb-4 text-wrap font-sans">{data?.product.description}</pre>
            <p className="text-sm mb-6">
              <span className="font-medium ">Availability:</span>{" "}
              <span
                className={
                  (data?.product.stock as number) > 0
                    ? "text-green-600 capitalize"
                    : "text-red-600"
                }
              >
                {(data?.product.stock as number) > 0
                  ? `In Stock (${data?.product.stock} ${data?.product.stockUnit})`
                  : "Out of Stock"}
              </span>
            </p>
            <p className="text-sm mb-6">
              <span className="font-semibold text-gray-400">Supplier:</span>{" "}
              <span>{data?.sellerName}</span>
            </p>
            <p className="text-sm mb-6">
              <span className="font-semibold text-gray-400">Company:</span>{" "}
              <span>{data?.sellerCompany}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline">
              <Link href={`/buy/${id}`} className="flex items-center gap-2"><User className="mr-2 h-4 w-4" /> Contact Supplier</Link>
            </Button>
          </div>

        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          <ProductRatings
            productId={id}
            ratings={data?.ratings as Rating[]}
            ratingCount={data?.ratingCount as number}
            ratingSum={data?.ratingSum as number}
            ratingAverage={data?.ratingAverage as number}
          />
        </Suspense>
      </div>
      <SellerProducts sellerId={data?.sellerId} productId={id} />
      <MoreProducts sellerId={data?.sellerId} />
    </div>
  }
}