"use client"
import FallbackImage from "@/lib/imgLoader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

interface Order {
  _id: string
  name: string
  quantity: number
  stockUnit: string
  ci?: string
  tone?: string
  contact: string
  contactMethod: "whatsapp" | "phone" | "email"
  note?: string
  image: string
  seller?: string
  sellerName?: string
  createdAt: string
}

interface RequestCardProps {
  order: Order
}

export default function RequestCard({ order }: RequestCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleContact = () => {
    const message = `Hello, I am interested in your product: 
    Request ID: ${order._id}
    Stock Name: ${order.name}
    Quantity: ${order.quantity}
    CI: ${order.ci ? order.ci : "Not Specified"}
    Tone: ${order.tone ? order.tone : "Not Specified"}
    Note: ${order.note ? order.note : "Not Specified"}
    Request's Contact: ${order.contact}
    Request's Contact Method: ${order.contactMethod}
    `
    const sendMessage = encodeURIComponent(message)
    if (order.contactMethod === "whatsapp") {
      window.open(`https://wa.me/${order.contact}?text=${sendMessage}`, "_blank", "noopener noreferrer")
    } else if (order.contactMethod === "phone") {
      window.open(`tel:${order.contact}`, "_blank", "noopener noreferrer")
    } else {
      window.open(`mailto:${order.contact}?subject=Request for Stock&body=${sendMessage}`, "_blank", "noopener noreferrer")
    }
  }

  const getStockDisplay = (quantity: number, unit: string) => {
    const unitMap = {
      kg: "kg",
      grm: "g",
      mg: "mg",
      ml: "ml",
      ltr: "L",
      pcs: "pcs",
      mts: "m",
    }
    return `${quantity} ${unitMap[unit as keyof typeof unitMap] || unit}`
  }

  return (
    <Card className="group flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Product Image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <FallbackImage
              src={order.image}
              alt={order.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {order.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Quantity */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-base text-muted-foreground">Quantity:</span>
          <Badge variant="outline" className="font-medium">
            {getStockDisplay(order.quantity, order.stockUnit)}
          </Badge>
        </div>

        {/* Optional Fields */}
        {(order.ci || order.tone) && (
          <div className="flex gap-2 justify-between mb-3 items-center">
            {order.ci && (
              <div className="text-base">
                <span className="text-muted-foreground">CI:</span>
                <span className="ml-1 font-medium">{order.ci}</span>
              </div>
            )}
            {order.tone && (
              <div className="text-base">
                <span className="text-muted-foreground">Tone:</span>
                <span className="ml-1 font-medium">{order.tone}</span>
              </div>
            )}
          </div>
        )}

        {/* Seller Information */}
        {order.sellerName && (
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-base text-muted-foreground">Seller:</span>
            <span className="text-base font-medium">{order.sellerName}</span>
          </div>
        )}

        {/* Note Preview */}
        {order.note && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <p className="text-base first-letter:uppercase text-muted-foreground line-clamp-2" title={order.note}>{order.note}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <button onClick={handleContact} className="w-full py-2 mx-auto bg-primary hover:bg-primary/80 active:bg-primary/90 text-primary-foreground rounded-lg flex items-center justify-center gap-2 text-xl">
          <User className="relative -top-0.5 h-6 w-6" />
          Contact
        </button>
      </CardFooter>
    </Card>
  )
}
