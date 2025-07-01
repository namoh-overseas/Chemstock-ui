"use client";
import FallbackImage from "@/lib/imgLoader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

interface MyRequest {
  _id: string;
  name: string;
  quantity: number;
  stockUnit: string;
  ci?: string;
  tone?: string;
  contact: string;
  contactMethod: "whatsapp" | "phone" | "email";
  note?: string;
  image?: string;
  isVerified?: boolean;
  seller?: string;
  sellerName?: string;
  sellerContact?: string;
  sellerEmail?: string;
  status?: string;
  createdAt: string;
}

interface RequestCardProps {
  request: MyRequest;
}

export default function MyRequestCard({ request }: RequestCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStockDisplay = (quantity: number, unit: string) => {
    const unitMap = {
      kg: "kg",
      grm: "g",
      mg: "mg",
      ml: "ml",
      ltr: "L",
      pcs: "pcs",
      mts: "m",
    };
    return `${quantity} ${unitMap[unit as keyof typeof unitMap] || unit}`;
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  };

  const getContactIcon = (method: string) => {
    switch (method) {
      case "whatsapp":
        return <MessageCircle className="w-4 h-4" />;
      case "phone":
        return <Phone className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Product Image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            {request.image ? (
              <FallbackImage
                src={request.image || "/placeholder.svg"}
                alt={request.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-xs font-medium">
                  {request.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {request.name}
              </h3>
              {/* Verification Status */}
              <div className="flex-shrink-0">
                {request.isVerified ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatDate(request.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between mt-3">
          <Badge
            variant={getStatusVariant(request?.status || "pending")}
            className="capitalize"
          >
            {request?.status || "Pending"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {request.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Quantity */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-base text-muted-foreground">Quantity:</span>
          <Badge variant="outline" className="font-medium">
            {getStockDisplay(request.quantity, request.stockUnit)}
          </Badge>
        </div>

        {/* CI and Tone */}
        {(request.ci || request.tone) && (
          <div className="flex gap-2 justify-between mb-3 items-center">
            {request.ci && (
              <div className="text-base">
                <span className="text-muted-foreground">CI:</span>
                <span className="ml-1 font-medium">{request.ci}</span>
              </div>
            )}
            {request.tone && (
              <div className="text-base">
                <span className="text-muted-foreground">Tone:</span>
                <span className="ml-1 font-medium">{request.tone}</span>
              </div>
            )}
          </div>
        )}

        {/* Contact Information */}
        <div className="flex items-center gap-2 my-3">
          {getContactIcon(request.contactMethod)}
          <span className="md:text-base text-muted-foreground">Your Contact:</span>
          <span className="text-base font-medium overflow-x-auto">{request.contact}</span>
          <Badge variant="outline" className="text-xs capitalize ml-auto">
            {request.contactMethod}
          </Badge>
        </div>

        {/* Seller Information */}
        {request.seller && (
          <div className="flex flex-col gap-2 bg-muted p-2 rounded-md">
            {request.sellerName && (
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-base text-muted-foreground">Seller:</span>
                <span className="text-base font-medium">
                  {request.sellerName}
                </span>
              </div>
            )}

            {request.sellerEmail && (
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-base text-muted-foreground">Email:</span>
                <span className="text-base font-medium overflow-x-auto">
                  {request.sellerEmail}
                </span>
              </div>
            )}

            {request.sellerContact && (
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-base text-muted-foreground">
                  Contact:
                </span>
                <span className="text-base font-medium">
                  {request.sellerContact}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Note Preview */}
        {request.note && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <p
              className="text-base first-letter:uppercase text-muted-foreground line-clamp-4"
              title={request.note}
            >
              {request.note}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
