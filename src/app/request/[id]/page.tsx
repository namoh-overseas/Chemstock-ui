"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getRequestById, updateRequest } from "@/app/api/admin/requests";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FallbackImage from "@/lib/imgLoader";
import redirect from "@/lib/redirect";
import { useStore } from "@/store";

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

interface RequestData {
  name: string;
  quantity: number;
  stockUnit: string;
  ci?: string;
  tone?: string;
  contact: string;
  contactMethod: "whatsapp" | "phone" | "email";
  description?: string;
}

export default function RequestPage() {
  const { user } = useStore();
  const [imageUrl, setImageUrl] = useState<string | File>("");
  const [imageType, setImageType] = useState<"url" | "file">("file");
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState<RequestData>({
    name: "",
    quantity: 1,
    stockUnit: "kg",
    ci: "",
    tone: "",
    contact: "",
    contactMethod: "whatsapp",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const getRequest = async () => {
    if (id) {
      const response = await getRequestById(id as string);
      if (response) {
        setImageUrl(response.image);
        setImageType("url");
        setFormData(response);
        setFormData((prev) => ({ ...prev, description: response.note }));
      }
    }
  };

  if (user?.role !== "admin") {
    redirect("/");
  }
  useEffect(() => {
    if (id) {
      getRequest();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequest = async () => {
    setLoading(true);
    try {
      const response = await updateRequest(id as string, formData, imageUrl);
      if (response) {
        setIsSent(true);
        // setImageUrl(response.image);
        // redirect("/admin?tab=requests");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Update a Stock Request
      </h1>

      <form className="space-y-6">
        <div className="">
          <p className="text-red-500">
            <span className="font-bold text-gray-500">Note: </span>{" "}
            <span>
              After submitting the request, Admin will approve it and then it
              will be listed on the Inquiry page.
            </span>
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="space-y-2 flex md:flex-row flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="ci">CI Number (Optional)</Label>
            <Input
              id="ci"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              placeholder="Enter CI number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Product Tone (Optional)</Label>
            <Input
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              placeholder="Enter product tone"
            />
          </div>
        </div>

        <div className="space-y-2 flex gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Stock Needed</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter stock needed"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockUnit">Stock Unit</Label>
            <Select
              onValueChange={(e: string) => handleSelectChange("stockUnit", e)}
              defaultValue={formData.stockUnit}
              value={formData.stockUnit}
            >
              <SelectTrigger className="capitalize">
                <SelectValue>{formData.stockUnit}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {["kg", "grm", "mg", "ml", "ltr", "pcs", "mts"].map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactMethod">Preferred Contact Method</Label>
          <Select
            defaultValue={formData.contactMethod}
            value={formData.contactMethod}
            onValueChange={(value) =>
              handleSelectChange("contactMethod", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select contact method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactDetail">Contact Details</Label>
          <Input
            id="contactDetail"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder={
              formData.contactMethod === "whatsapp"
                ? "WhatsApp number"
                : formData.contactMethod === "email"
                ? "Email address"
                : "Phone number"
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Additional Details (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please provide any specific details about the product you're looking for"
          />
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

        <Button type="button" onClick={handleRequest} className="w-full">
          {loading ? "Updating..." : "Update Now"}
        </Button>
      </form>
      {isSent && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-screen h-screen bg-black/50">
          <div className="flex items-center justify-center relative">
            <div onClick={() => setIsSent(false)} className="absolute top-2 right-2 cursor-pointer border-2 border-red-500 size-6 bg-red-100 hover:bg-red-200 text-center rounded-full"><span className=" cursor-pointer text-red-500">X</span></div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Request Updated!</h2>
              <p className="mb-4 text-center max-w-xl mx-auto">
                Your request has been updated successfully.
              </p>
              <Button
                onClick={() => redirect("/admin?tab=requests")}
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
