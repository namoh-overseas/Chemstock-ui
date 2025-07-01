"use client";

import FallbackImage from "@/lib/imgLoader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Eye, MessageCircle } from "lucide-react";
import { useStore } from "@/store";
import { Switch } from "./ui/switch";
import redirect from "@/lib/redirect";

interface Product {
  _id: string;
  name: string;
  price: number;
  currency: "INR" | "USD";
  ci: string;
  tone: string;
  stock: number;
  stockUnit: "kg" | "grm" | "mg" | "ml" | "ltr" | "pcs" | "mts";
  image: string;
  seller: {
    id: string;
    username: string;
    company: string;
  };
  isFeatured: boolean;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onContactSeller?: (product: Product) => void;
  onRequestQuote?: (product: Product) => void;
  usdToInrRate: number;
}

export default function ProductCard({
  product,
  usdToInrRate,
}: ProductCardProps) {
  const { currency, switchCurrency } = useStore();

  const getStockDisplay = (stock: number, unit: string) => {
    const unitMap = {
      kg: "kg",
      grm: "g",
      mg: "mg",
      ml: "ml",
      ltr: "L",
      pcs: "pcs",
      mts: "m",
    };
    return `${stock} ${unitMap[unit as keyof typeof unitMap] || unit}`;
  };

  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="group scale-95 max-md:mx-auto min-w-75 max-w-96 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Status Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isFeatured && (
          <Badge
            variant="default"
            className="bg-orange-100 text-orange-800 border-orange-800 group-hover:bg-orange-200 group-hover:text-orange-800"
          >
            <Star className="w-3 h-3 mr-1 group-hover:fill-current" />
            Featured
          </Badge>
        )}
      </div>

      <div className="size-full flex flex-col justify-between">
        <div className="relative aspect-square overflow-hidden">
          <FallbackImage
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-lg text-center mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Product Price */}
          <div className="flex items-center justify-between gap-2">
            <div className="">
              <span
                className="text-xl transition-all duration-300 ease-in-out"
                title={currency == "INR" ? "Indian Rupee" : "US Dollar"}
              >
                {currency == "INR" ? "₹" : "$"}{" "}
              </span>
              <span className="text-2xl font-bold transition-all duration-300 ease-in-out">
                {(product.currency === "INR" && currency === "INR") ||
                (product.currency === "USD" && currency === "USD")
                  ? product.price
                  : product.currency === "INR" && currency !== "INR"
                  ? (product.price / usdToInrRate).toFixed(2)
                  : product.currency === "USD" && currency !== "USD"
                  ? Math.round(product.price * usdToInrRate)
                  : 0}
              </span>
              <span className="ml-2 text-sm text-gray-500 capitalize">
                / {product.stockUnit}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span
                className={`md:text-xl text-sm transition-all duration-300 ease-in-out ${
                  currency === "INR"
                    ? "font-bold text-primary"
                    : "font-normal text-gray-400"
                }`}
              >
                ₹
              </span>
              <Switch
                className="md:scale-100 scale-75"
                defaultChecked={currency === "INR"}
                checked={currency !== "INR"}
                onClick={() =>
                  switchCurrency(currency === "INR" ? "USD" : "INR")
                }
              />
              <span
                className={`md:text-xl text-sm transition-all duration-300 ease-in-out ${
                  currency !== "INR"
                    ? "font-bold text-primary"
                    : "font-normal text-gray-400"
                }`}
              >
                $
              </span>
            </div>
          </div>

          {/* Stock Information */}
          <div className="flex items-center justify-between my-2 xl:text-base text-xs">
            <span className="xl:text-base text-sm text-muted-foreground">
              Stock:
            </span>
            <Badge
              variant={
                isOutOfStock
                  ? "destructive"
                  : isLowStock
                  ? "secondary"
                  : "outline"
              }
              className={
                isLowStock && !isOutOfStock
                  ? "bg-yellow-100 text-yellow-800 md:text-lg text-sm border-yellow-300"
                  : "md:text-lg text-sm"
              }
            >
              {getStockDisplay(product.stock, product.stockUnit)}
            </Badge>
          </div>

          {/* Additional Info */}
          <div className="flex justify-between gap-2 xl:text-sm text-xs text-muted-foreground mb-3 md:mb-0">
            <div>
              CI:
              <span className="font-medium text-foreground"> {product.ci}</span>
            </div>
            <div>
              Tone:
              <span className="font-medium text-foreground">
                {" "}
                {product.tone}
              </span>
            </div>
          </div>

          {/* Seller Information */}
          <div className="flex items-center gap-2 xl:text-sm text-xs text-muted-foreground">
            <span>Supplier:</span>
            <span className="font-medium text-foreground">
              {product.seller.username}
            </span>
          </div>
          <div className="flex items-center gap-2 xl:text-sm text-xs text-muted-foreground mt-2">
            <span>Company:</span>
            <span className="font-medium text-foreground">
              {product.seller.company}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex w-full gap-2 justify-center items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => redirect(`/products/${product._id}`)}
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => redirect(`/buy/${product._id}`)}
          >
            <MessageCircle className="w-4 h-4" />
            Contact Seller
          </Button>
        </CardFooter>
      </div>

      {/* Product Image */}
    </Card>
  );
}
