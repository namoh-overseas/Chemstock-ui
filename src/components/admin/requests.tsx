"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, MessageSquare, UserCheck, Edit } from "lucide-react";
import { getRequests, verifyRequestById } from "@/app/api/admin/requests";
import FallbackImage from "@/lib/imgLoader";
import AssignSeller from "./assign-seller";
import { redirect } from "next/navigation";
import { useStore } from "@/store";

interface Order {
  _id: string;
  name: string;
  quantity: number;
  stockUnit: string;
  ci: string;
  tone: string;
  contact: string;
  contactMethod: "whatsapp" | "phone" | "email";
  note: string;
  image: string;
  isVerified: boolean;
  seller: string;
  sellerName: string;
  status: string;
  createdAt: string;
}

export default function SellerRequests() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
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

   const verifyProduct = async (productId: string) => {
        const response = await verifyRequestById(productId);
        if (response) {
          const updatedOrders = orders?.map((order) => {
            if (order._id === productId) {
              return { ...order, isVerified: !order.isVerified };
            }
            return order;
          });
          setRequestsCount(requestsCount + 1);
          setOrders(updatedOrders as Order[]);
        }
      };  

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Cancelled
          </Badge>
        );
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const contactCustomer = (contact: string, contactMethod: string) => {
    if (contactMethod === "phone") {
      window.open(`tel:${contact}`, "_blank", "noopener noreferrer");
    } else if (contactMethod === "whatsapp") {
      window.open(
        `https://wa.me/${contact}?text=Hello`,
        "_blank",
        "noopener noreferrer"
      );
    } else {
      window.open(`mailto:${contact}`, "_blank", "noopener noreferrer");
    }
  };

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
      pagination.limit
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
      pagination.page + 1 > pagination.totalPages
        ? pagination.totalPages
        : pagination.page,
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
    // }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Order Requests</h2>
        {/* <div className="relative w-full md:w-64">
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
        </div> */}
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
              <TableHead>Seller</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Is Verified</TableHead>
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
                        {order.image && (
                          <FallbackImage
                            src={order.image || "/placeholder.svg"}
                            alt={order.name}
                            height={50}
                            width={50}
                            className="object-cover size-full"
                            priority
                          />
                        )}
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
                    <p className="text-sm font-medium">{order.tone || "N/A"}</p>
                  </TableCell>
                  <TableCell>
                    {order.quantity} {order.stockUnit}
                  </TableCell>
                  <TableCell className="text-[10px]">
                    <Badge variant="outline">via - {order.contactMethod}</Badge>
                    <p className="text-sm">{order.contact}</p>
                  </TableCell>
                  <TableCell
                    className="text-sm"
                    title={order.note || "No note"}
                  >
                    <pre className="text-sm font-sans text-wrap line-clamp-2">
                      {order.note || "No note"}
                    </pre>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.seller ? 
                    <div className="">
                      <span className="text-[10px] text-gray-400 block">{order.seller}</span>
                      <span className="font-semibold">{order.sellerName}</span>
                    </div> : <Badge className="align-middle leading-4" variant="destructive">Not Assigned</Badge>}
                  </TableCell>
                  <TableCell className="text-sm">
                    {getStatusBadge(order.status)}
                  </TableCell>

                  {/* Verified */}
                  <TableCell>
                    <Badge
                      className="align-middle leading-4"
                      variant={order.isVerified ? "default" : "destructive"}
                    >
                      {order.isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="hover:bg-primary cursor-pointer"
                          onClick={() => redirect(`/request/${order._id}`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Request
                        </DropdownMenuItem>
                      {!order.isVerified && (
                          <DropdownMenuItem
                          className="hover:bg-primary cursor-pointer"
                            onClick={() => verifyProduct(order._id)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Verify Request
                          </DropdownMenuItem>
                        )}
                        {order.isVerified && !order.seller && (
                          <DropdownMenuItem
                          className="hover:bg-primary cursor-pointer"
                            onClick={() => setSelectedRequestId(order._id)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Assign Seller
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            contactCustomer(order.contact, order.contactMethod)
                          }
                        >
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
              className="h-9 w-12 text-center px-0.5 border-2 font-bold"
              disabled={pagination.totalPages <= 1}
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

      {selectedRequestId && (
        <div className="fixed flex items-center justify-center bg-black/30 inset-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
          <div className="relative p-4 bg-white w-full max-w-5xl h-full md:h-auto">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-xl font-semibold">Assign Seller</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setSelectedRequestId("")}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <AssignSeller requestId={selectedRequestId} />
          </div>
        </div>
      )}
    </div>
  );
}
