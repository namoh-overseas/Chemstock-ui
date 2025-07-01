"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buyProduct } from "@/app/api/user/buy";
import { getProduct } from "@/app/api/user/getProducts";
import { Product } from "@/app/products/[id]/page";
import FallbackImage, { imgLoader } from "@/lib/imgLoader";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import redirect from "@/lib/redirect";
import { getSellerContact } from "@/app/api/seller/getUser";

export const countryCodes = [
  "+91",
  "+1",
  "+44",
  "+971",
  "+966",
  "+972",
  "+961",
  "+962",
  "+963",
  "+964",
  "+965",
  "+967",
  "+968",
  "+969",
  "+970",
  "+973",
  "+974",
  "+975",
  "+976",
  "+977",
  "+978",
  "+979",
];

interface Contact {
  phoneNumber: string;
  email: string;
}

export default function BuyPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [contactType, setContactType] = useState<"whatsapp" | "email" | "phone">("whatsapp");
  const [formData, setFormData] = useState({
    quantity: 1,
    name: "",
    contactMethod: "whatsapp",
    countryCode: "+91",
    contactDetail: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getProduct(params.id as string);
      if (response) {
        setProduct(response);
      }
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    if (product) {
      const fetchContact = async () => {
        const response = await getSellerContact(params.id as string);
        if (response) {
          setContact(response);
        }
      };
      fetchContact();
    }
  }, [product]);

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
    setIsSubmitting(true);
    try {
      const message = `
New Order:
Product ID: ${params.id}
Product Name: ${product?.product.name}
Quantity: ${formData.quantity}
Customer: ${formData.name}
Contact: ${formData.contactMethod} - ${formData.contactDetail}
Notes: ${formData.description}
Subtotal: ${product?.product.currency === "INR" ? "₹" : "$"}${(
        (product?.product.price as number) * formData.quantity
      ).toFixed(2)}
      `.trim();

      const response = await buyProduct(
        params.id as string,
        formData.name,
        formData.countryCode + formData.contactDetail,
        formData.contactMethod,
        formData.quantity,
        formData.description
      );
      if (response) {
        const encodedMessage = encodeURIComponent(message);
        redirect(`/products`, { delayMs: 10000 });
        if(contactType === "whatsapp") {
        window.open(
          `https://wa.me/${contact?.phoneNumber}?text=${encodedMessage}`,
          "_blank",
          "noopener noreferrer"
        );
      } else if(contactType === "email") {
        window.open(
          `mailto:${contact?.email}?subject=New Order&body=${encodedMessage}`,
          "_blank",
          "noopener noreferrer"
        );
      } else {
        window.open(
          `tel:${contact?.phoneNumber}`,
          "_blank",
          "noopener noreferrer"
        );
      }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Complete Your Purchase
      </h1>

      <div className="md:grid md:grid-cols-2 md:gap-8">
        <Card className="overflow-hidden min-w-96 max-w-96 mx-auto max-h-112">
          <div className="relative h-48 w-full">
            <Link href={`/products/${params.id}`}>
              <FallbackImage
                src={product?.product.image || "/placeholder.svg"}
                alt={product?.product.name || ""}
                width={250}
                height={250}
                className="object-cover size-full transition-transform hover:scale-105"
                priority
              />
              {(product as Product)?.product.stock > 0 && (
                <Badge className="absolute top-2 right-2">In Stock</Badge>
              )}
            </Link>
          </div>
          <CardHeader>
            <Link href={`/products/${params.id}`}>
              <CardTitle className="text-lg hover:text-primary transition-colors">
                {product?.product.name}
              </CardTitle>
            </Link>
            <p className="text-sm text-gray-500">
              Seller: {product?.sellerName}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold mb-2">
              {product?.product.currency === "INR" ? "₹" : "$"}
              {product?.product.price.toFixed(2)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Availability:</span>{" "}
              <span
                className={
                  (product as Product)?.product.stock > 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {(product as Product)?.product.stock > 0
                  ? `${(product as Product)?.product.stock} ${
                      (product as Product)?.product.stockUnit
                    } available`
                  : "Out of Stock"}
              </span>
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild variant="default" className="flex-1">
              <Link href={`/products/${params.id}`}>Details</Link>
            </Button>
          </CardFooter>
        </Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactMethod">
              Preferred Contact Method (Optional)
            </Label>
            <Select
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
            <Label htmlFor="contactDetail">Contact Details (Optional)</Label>
            <div className="flex gap-2">
              {(formData.contactMethod === "whatsapp" || formData.contactMethod === "phone") && <Select
                value={formData.countryCode}
                onValueChange={(value) =>
                  handleSelectChange("countryCode", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country code" />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((code, index) => (
                    <SelectItem key={index} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>}

              <Input
                id="contactDetail"
                name="contactDetail"
                value={formData.contactDetail}
                onChange={handleChange}
                placeholder={
                  formData.contactMethod === "whatsapp"
                    ? "WhatsApp number"
                    : formData.contactMethod === "email"
                    ? "Email address"
                    : "Phone number"
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Notes (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any special requirements or information for the seller"
            />
          </div>
          <div className="flex justify-between">
            <p className="text-lg font-bold">
              <span className="text-sm text-gray-500">Price:</span>
              {" : "}
              <sub>{product?.product.currency === "INR" ? "₹" : "$"}</sub>
              {product?.product.price.toFixed(2)}
            </p>
            <p className="text-lg font-bold">
              <span className="text-sm text-gray-500">Subtotal</span>
              {" : "}
              <sub>{product?.product.currency === "INR" ? "₹" : "$"}</sub>
              {((product?.product.price as number) * formData.quantity).toFixed(
                2
              )}
            </p>
          </div>
          {contact && (
            <>
              <Select
                onValueChange={(e: "whatsapp" | "email" | "phone") => setContactType(e)}
                defaultValue={contactType}
                value={contactType}
              >
                <SelectTrigger className="capitalize">
                  <SelectValue>{contactType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="hover:bg-primary cursor-pointer"
                    value="whatsapp"
                  >
                    WhatsApp
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary cursor-pointer"
                    value="email"
                  >
                    Email
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary cursor-pointer"
                    value="phone"
                  >
                    Phone
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Contact Supplier
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
