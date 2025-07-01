"use client";

import type React from "react";
import FallbackImage from "@/lib/imgLoader";
import { useState, useEffect } from "react";
import redirect from "@/lib/redirect";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { use } from "react";
import { Params } from "next/dist/server/request/params";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProduct, updateProduct } from "@/app/api/admin/getAllProducts";
import toast from "react-hot-toast";

export interface ProductData {
  name: string;
  description: string;
  price: number;
  currency: "USD" | "INR";
  stock: string;
  tone: string;
  ci: string;
  stockUnit: "kg" | "grm" | "mg" | "ml" | "ltr" | "pcs" | "mts";
}

const stockUnits = ["kg", "grm", "mg", "ml", "ltr", "pcs", "mts"];

export default function UpdateProductPage(props: { params: Promise<Params> }) {
  const { id } = use(props.params) as { id: string };
  const { isAuthenticated, currency, user } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | File>("");
  const [imageType, setImageType] = useState<"url" | "file">("file");
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    currency: currency,
    stock: "",
    tone: "",
    ci: "",
    stockUnit: "kg",
  });

  const getProductData = async () => {
    const product = await getProduct(id);
    if (product) {
      setFormData((prev) => ({
        ...prev,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        stock: product.stock,
        tone: product.tone,
        ci: product.ci,
        stockUnit: product.stockUnit,
      }));
      setImageUrl(product.image);
      setImageType("url");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(file);
    }
  };

  if (!isAuthenticated && user?.role !== "admin") {
    redirect("/admin?tab=products");
  }
  useEffect(() => {
    getProductData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let error = false;
    if (!formData.name) {
      toast.error("Product name is required");
      error = true;
    }

    if (!formData.ci) {
      toast.error("CI number is required");
      error = true;
    }

    if (!formData.tone) {
      toast.error("Product tone is required");
      error = true;
    }

    if (!formData.stock) {
      toast.error("Stock quantity is required");
      error = true;
    }

    if (!formData.price) {
      toast.error("Price is required");
      error = true;
    }

    if (error) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await updateProduct(id, formData, imageUrl);
      if (response) {
        setIsSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Update Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ci">
            CI Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ci"
            name="ci"
            type="text"
            value={formData.ci}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">
            Product Tone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tone"
            name="tone"
            type="text"
            value={formData.tone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">
              Price ({formData.currency}){" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <div className="">
                <Select
                  onValueChange={(e: string) =>
                    handleSelectChange("currency", e)
                  }
                  defaultValue={formData.currency}
                  value={formData.currency}
                >
                  <SelectTrigger>
                    <SelectValue>{formData.currency}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">
              Stock Quantity <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="stock"
                name="stock"
                type="number"
                min="1"
                value={formData.stock}
                onChange={handleChange}
                required
              />
              <div className="">
                <Select
                  onValueChange={(e: string) =>
                    handleSelectChange("stockUnit", e)
                  }
                  defaultValue={formData.stockUnit}
                  value={formData.stockUnit}
                >
                  <SelectTrigger>
                    <SelectValue>{formData.stockUnit}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {stockUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {isValidUrl(imageUrl as string) && imageType === "url" && (
          <div className="space-y-2">
            <FallbackImage
              src={imageUrl as string}
              alt={formData.name}
              width={400}
              height={400}
              className="rounded-md size-72 object-cover mx-auto border-2 shadow-md shadow-black/40 border-gray-200"
              priority
            />
          </div>
        )}
        {imageUrl instanceof File && imageType === "file" && (
          <div className="space-y-2">
            <FallbackImage
              src={URL.createObjectURL(imageUrl)}
              alt={formData.name}
              width={400}
              height={400}
              className="rounded-md size-72 object-cover mx-auto border-2 shadow-md shadow-black/40 border-gray-200"
              priority
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="imageType">Upload Image (Optional)</Label>
          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4">
            <Select
              onValueChange={(e: "url" | "file") => setImageType(e)}
              defaultValue={imageType}
              value={imageType}
            >
              <SelectTrigger className="capitalize">
                <SelectValue>{imageType}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="hover:bg-primary cursor-pointer"
                  value="file"
                >
                  File
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary cursor-pointer"
                  value="url"
                >
                  URL
                </SelectItem>
              </SelectContent>
            </Select>
            {imageType === "file" ? (
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            ) : (
              <>
                <Label className="w-28" htmlFor="imageUrl">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="text"
                  value={imageUrl as string}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating Product..." : "Update Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => redirect("/seller")}
          >
            Cancel
          </Button>
        </div>
      </form>
      {isSent && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-screen h-screen bg-black/50">
          <div className="flex items-center justify-center relative">
            <div
              onClick={() => setIsSent(false)}
              className="absolute top-2 right-2 cursor-pointer border-2 border-red-500 size-6 bg-red-100 hover:bg-red-200 text-center rounded-full"
            >
              <span className=" cursor-pointer text-red-500">X</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Product Updated!</h2>
              <p className="mb-4 text-center max-w-xl mx-auto">
                Your product has been updated successfully.
              </p>
              <Button
                onClick={() => redirect("/admin?tab=products")}
                className="w-full"
              >
                Go to Admin Panel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
