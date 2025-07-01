"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import RequestCard from "@/components/request-card"
import { getRequests, searchRequests } from "../api/user/requests"
import { Button } from "@/components/ui/button"
import {useStore} from "@/store"

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

export default function RequestListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [requests, setRequests] = useState<Order[]>()
  const [loading, setLoading] = useState(true)
  const {setRequestsCount} = useStore()
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    result: 0,
  });

  const getAllRequests = async (page: number = 1, limit: number = 25, sortOrder: 'asc' | 'desc' = 'asc') => {
    setLoading(true);
    const response = await getRequests(page, limit, sortOrder);
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.count,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setRequests([...response.requests]);
      setRequestsCount(response.count);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllRequests(pagination.page, pagination.limit);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSearch = async () => {
      setLoading(true);
      if (searchTerm === "") {
        getAllRequests();
        return;
      }
      const response = await searchRequests(searchTerm,pagination.page,pagination.limit);
      if (response) {
        setPagination((prev) => ({
          ...prev,
          result: response.count,
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        }));
        setRequests([...response.requests]);
        setLoading(false);
      }
    };

    
  const handlePreviousPage = () => {
    if (!pagination) return;
    if (searchTerm === "") {
      if (pagination.page > 1) {
        getAllRequests(pagination.page - 1, pagination.limit);
      }
    } else {
      if (pagination.page > 1) {
        handleSearch();
      }
    }
  };

  const handleNextPage = () => {
    if (!pagination) return;
    if (searchTerm === "") {
      if (pagination.page < pagination.totalPages) {
        getAllRequests(pagination.page + 1, pagination.limit);
      }
    } else {
      if (pagination.page < pagination.totalPages) {
        handleSearch();
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Product Requests</h1>
          <p className="text-muted-foreground">Manage and track all product requests</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {requests?.length} requests
        </Badge>
      </div>
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by product name, contact, or seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Request Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests?.map((request) => (
          <RequestCard key={request._id} order={request} />
        ))}
      </div>

      {/* pagination */}
      {pagination && <div className="flex items-center justify-end space-x-2">
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
          disabled={pagination.page <= 1}
        >
          {pagination.page.toString()}
        </Button>
        <span>/</span>
        <p>{pagination.totalPages}</p>
        <Button
          className="cursor-pointer"
          disabled={pagination.totalPages <= 1}
          onClick={handleNextPage}
        >
          Next
        </Button>
      </div>}

      {requests?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No requests found matching your criteria.</p>
        </div>
      )}
      
    </div>
  )
}
