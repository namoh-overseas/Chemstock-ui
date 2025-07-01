"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, MessageSquare, Trash, Check } from "lucide-react"
import { getRequests, updateRequestStatus } from "@/app/api/seller/addRequest"
import FallbackImage from "@/lib/imgLoader"
import { useStore } from "@/store"


interface Order {
    _id: string,
    name: string,
    quantity: number,
    stockUnit: string,
    ci: string,
    tone: string,
    contact: string,
    address: string,
    contactMethod: 'whatsapp' | 'phone' | 'email',
    note: string,
    image: string,
    status: string,
    createdAt: string,
}


export default function SellerRequests() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    result: 0,
  });

  const { setRequestsCount, requestsCount } = useStore();

  const getAllOrders = async (page: number = 1, limit: number = 25) => {
    const response = await getRequests(page, limit);
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.count,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setOrders([...response.orders]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders(pagination.page, pagination.limit);
  }, []);

  function formatDate(isoDate: string) {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    };

    return new Intl.DateTimeFormat("en-IN", options).format(date);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Cancelled
          </Badge>
        )
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>
    }
  }

  const contactCustomer = (contact: string, contactMethod: string) => {
    if (contactMethod === "phone") {
      window.open(`tel:${contact}`, "_blank", "noopener noreferrer");
    }
    else if (contactMethod === "whatsapp") {
      window.open(`https://wa.me/${contact}?text=Hello`, "_blank", "noopener noreferrer");
    } else {
      window.open(`mailto:${contact}`, "_blank", "noopener noreferrer");
    }
  }

  const handlePreviousPage = async () => {
    // if (statusFilter) {
    //   const response = await filterOrderStatus(
    //     pagination.page - 1 <= 1 ? 1 : pagination.page - 1,
    //     pagination.limit
    //   );
    //   if (response) {
    //     setPagination((prev) => ({
    //       ...prev,
    //       result: response.count,
    //       page: response.page,
    //       limit: response.limit,
    //       total: response.total,
    //       totalPages: response.totalPages,
    //     }));
    //     setOrders([...response.orders]);
    //   }
    // } 
    // else if (searchQuery) {
    //   const response = await searchOrders(
    //     searchQuery,
    //     pagination.page - 1 <= 1 ? 1 : pagination.page - 1,
    //     pagination.limit
    //   );
    //   if (response) {
    //     setPagination((prev) => ({
    //       ...prev,
    //       result: response.count,
    //       page: response.page,
    //       limit: response.limit,
    //       total: response.total,
    //       totalPages: response.totalPages,
    //     }));
    //     setOrders([...response.orders]);
    //   }
    // }
    // else {
      const response = await getRequests(
        pagination.page - 1 <= 1 ? 1 : pagination.page - 1,
        pagination.limit,
        // sortOrder
      );
      if (response) {
        setPagination((prev) => ({
          ...prev,
          result: response.count,
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        }));
        setOrders([...response.orders]);
    //   }
    }
  };

  const handleNextPage = async () => {
    // if (statusFilter) {
    //   const response = await filterOrderStatus(
    //     statusFilter as "pending" | "completed" | "cancelled",
    //     pagination.page + 1 > pagination.totalPages ? pagination.totalPages : pagination.page,
    //     pagination.limit,
    //   );
    //   if (response) {
    //     setPagination((prev) => ({
    //       ...prev,
    //       result: response.count,
    //       page: response.page,
    //       limit: response.limit,
    //       total: response.total,
    //       totalPages: response.totalPages,
    //     }));
    //     setOrders([...response.orders]);
    //   }
    // } else {
      const response = await getRequests(
        pagination.page + 1 > pagination.totalPages ? pagination.totalPages : pagination.page, pagination.limit);
      if (response) {
        setPagination((prev) => ({
          ...prev,
          result: response.count,
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        }));
        setOrders([...response.orders]);
      }
    // }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    const updated = await updateRequestStatus(orderId, status)
    if (updated) {
      // setRequestsCount(requestsCount - 1);
      const updatedOrders = orders.map((order) => {
        if (order._id === orderId) {
          return { ...order, status }
        }
        return order
      })
      setOrders(updatedOrders)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Order Requests</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requested Product</TableHead>
              <TableHead>CI Number</TableHead>
              <TableHead>Product Tone</TableHead>
              <TableHead>Stock Needed</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading requests...
                </TableCell>
              </TableRow>
            ) : orders?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              orders?.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                            {
                                order.image &&
                            <FallbackImage
                                src={order.image || "/placeholder.svg"}
                                alt={order.name}
                                height={50}
                                width={50}
                                className="object-cover size-full"
                                priority
                            />
                            }
                        </div>
                        <div className="font-medium line-clamp-2">
                          <sub className="text-xs text-gray-400 block">
                            {order._id}
                          </sub>
                          {order.name}
                        </div>
                      </div>
                  </TableCell>
                  <TableCell className="text-sm">{order.ci || "N/A"}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">
                      {order.tone || "N/A"}
                    </p>
                  </TableCell>
                  <TableCell>{order.quantity} {order.stockUnit}</TableCell>
                  <TableCell className="text-[10px]">
                    <Badge variant="outline">via - {order.contactMethod}</Badge>
                    <p className="text-sm">{order.contact}</p>
                  </TableCell>
                  <TableCell className="text-sm" title={order.note || "No note"}>
                    <pre className="text-sm font-sans text-wrap line-clamp-2">{order.note || "No note"}</pre>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-sm">{getStatusBadge(order.status)}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {order.status === "pending" && (
                          <DropdownMenuItem>
                            <div className="flex flex-col gap-2">
                              <Button onClick={() => handleStatusChange(order._id, "completed")} variant="outline" className="bg-green-500 text-white">
                                <Check className="h-4 w-4 text-white" />
                                Mark as Completed
                              </Button>
                              <Button onClick={() => handleStatusChange(order._id, "cancelled")} variant="destructive" className="bg-red-500 text-white">
                                <Trash className="h-4 w-4 text-white" />
                                Cancel Order
                              </Button>
                            </div>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="cursor-pointer" onClick={() => contactCustomer(order.contact, order.contactMethod)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* pagination */}
        <div className="m-2">
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={pagination.page <= 1}
              onClick={handlePreviousPage}
            >
              Previous
            </Button>
            <Button
              className="h-9 w-12 text-center px-0.5 border-2 font-bold" disabled={pagination.totalPages <= 1}
            >
              {pagination.page.toString()}
            </Button>
            <span>/</span>
            <p>{pagination.totalPages || 1}</p>
            <Button
              className="cursor-pointer"
              disabled={pagination.totalPages <= 1}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
