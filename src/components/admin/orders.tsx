"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Search, MessageSquare } from "lucide-react"
import { getOrders, filterOrderStatus, searchOrders } from "@/app/api/admin/orders"
import { redirect } from "next/navigation"

interface Order {
  _id: string;
  product: string,
  productName: string,
  buyerName: string,
  buyerContact: string,
  contactMethod: string,
  buyerAddress: string,
  quantity: number,
  price: number,
  currency: string,
  note: string,
  totalAmount: number,
  status: string,
  createdAt: string,
  updatedAt: string
}


export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>("all")
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    result: 0,
  });

  const getAllOrders = async (page: number = 1, limit: number = 25, sortOrder: 'asc' | 'desc' = 'asc') => {
    const response = await getOrders(page, limit, sortOrder);
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
    getAllOrders(pagination.page, pagination.limit, sortOrder);
  }, [sortOrder]);

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
        return <Badge>{status}</Badge>
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
    if (statusFilter) {
      const response = await filterOrderStatus(
        statusFilter as "pending" | "completed" | "cancelled",
        pagination.page - 1 <= 1 ? 1 : pagination.page - 1,
        pagination.limit
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
      }
    } 
    else if (searchQuery) {
      const response = await searchOrders(
        searchQuery,
        pagination.page - 1 <= 1 ? 1 : pagination.page - 1,
        pagination.limit
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
      }
    }
    else {
      const response = await getOrders(
        pagination.page - 1 <= 1 ? 1 : pagination.page - 1,
        pagination.limit,
        sortOrder
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
      }
    }
  };

  const handleNextPage = async () => {
    if (statusFilter) {
      const response = await filterOrderStatus(
        statusFilter as "pending" | "completed" | "cancelled",
        pagination.page + 1 > pagination.totalPages ? pagination.totalPages : pagination.page,
        pagination.limit,
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
      }
    } else {
      const response = await getOrders(
        pagination.page + 1 > pagination.totalPages ? pagination.totalPages : pagination.page, pagination.limit, sortOrder);
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
    }
  };

  const filterOrdersByStatus = async (status: string, page: number, limit: number) => {
    const response = await filterOrderStatus(status as "pending" | "completed" | "cancelled", page, limit);
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.count,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setOrders(response.orders?.length > 0 ? [...response.orders] : []);
    }
  };

  const searchOrdersByQuery = async (query: string, page: number, limit: number) => {
    const response = await searchOrders(query, page, limit);
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.count,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setOrders(response.orders?.length > 0 ? [...response.orders] : []);
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      searchOrdersByQuery(searchQuery, pagination.page, pagination.limit);
    } else {
      getAllOrders(pagination.page, pagination.limit);
    }
  };

  useEffect(() => {
    if (statusFilter === "all") {      
      getAllOrders(pagination.page, pagination.limit);
    } else {
      filterOrdersByStatus(statusFilter, pagination.page, pagination.limit);
    }
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Order Requests</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'pending' | 'completed' | 'cancelled')}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Newest First</SelectItem>
              <SelectItem value="desc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Buyer Name</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Contact Method</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders?.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium text-xs">
                    {order._id}</TableCell>
                  <TableCell className="text-sm">{order.buyerName}</TableCell>
                  <TableCell>
                    <span onClick={() => redirect(`/product/${order.product}`)} className="flex text-[12px] items-center">
                      <Eye className="mr-2" size={16} />
                      {order.product}
                    </span>
                    <p className="text-sm font-medium">
                      {order.productName}
                    </p>
                  </TableCell>
                  <TableCell className="text-[10px]">
                    <Badge variant="outline">via - {order.contactMethod}</Badge>
                    <p className="text-sm">{order.buyerContact}</p>
                  </TableCell>
                  <TableCell className="text-sm" title={order.note}>
                    <pre className="text-sm font-sans text-wrap line-clamp-2">{order.note || "No note"}</pre>
                  </TableCell>
                  <TableCell className="text-sm text-center">{order.quantity}</TableCell>
                  <TableCell className="text-sm text-center"><sub>{order.currency === "INR" ? "₹" : "$"}</sub>{order.price.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-center">
                    <sub>{order.currency === "INR" ? "₹" : "$"}</sub>
                    {order.totalAmount.toFixed(2)}</TableCell>
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
                        <DropdownMenuItem onClick={() => redirect(`/products/${order.product}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => contactCustomer(order.buyerContact, order.contactMethod)}>
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
