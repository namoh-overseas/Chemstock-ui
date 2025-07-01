"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import MyRequestCard from "@/components/my-request-card"
import { getUserRequests } from "../api/user/requests"
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
  const [userRequests, setUserRequests] = useState<Order[]>()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const {requests} = useStore()

  const getAllRequests = async (reqs: string[]) => {
    setLoading(true);
    const response = await getUserRequests(reqs);
    if (response) {
      setUserRequests([...response?.requests || []]);
      setCount(response.count);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllRequests(requests);
  }, [requests]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Requests</h1>
          <p className="text-muted-foreground">Manage and track all product requests</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {count} requests
        </Badge>
      </div>
      {/* Request Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userRequests?.map((request) => (
          <MyRequestCard key={request._id} request={request} />
        ))}
      </div>

      {userRequests?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No requests found matching your criteria.</p>
        </div>
      )}
      
    </div>
  )
}
