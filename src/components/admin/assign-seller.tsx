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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserCheck,
} from "lucide-react";
import {
  getUsers,
  assignSellerById,
  getAssigningSellers,
} from "@/app/api/admin/requests";
import { formatDate } from "@/components/product-ratings";
import { useStore } from "@/store";

interface Seller {
  _id: string;
  username: string;
  email: string;
  company: string;
  address: string;
  totalProducts: number;
  createdAt: string;
  speciality: string[];
  isActive: boolean;
  isVerified: boolean;
  countryCode: string;
  phoneNumber: string;
  specialties: string[];
}

export default function AssignSeller({ requestId }: { requestId: string }   ) {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { setRequestsCount, requestsCount } = useStore();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    result: 0,
  });
  const getAllSellers = async (page: number = 1, limit: number = 25) => {
    const response = await getUsers(page, limit);
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.result,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setSellers([...response.sellers]);
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery("");
    getAllSellers();
  }, []);

  const handlePreviousPage = async () => {
    const response = await getUsers(
      pagination.page - 1 <= 1 ? 1 : pagination.page - 1,
      pagination.limit
    );
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.result,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setSellers([...response.sellers]);
    }
  };

  const handleNextPage = async () => {
    const response = await getUsers(
      pagination.page + 1 > pagination.totalPages
        ? pagination.totalPages
        : pagination.page,
      pagination.limit
    );
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.result,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setSellers([...response.sellers]);
    }
  };

  const assignSeller = async (sellerId: string) => {
    const response = await assignSellerById(sellerId, requestId);
    if(response) {
      setRequestsCount(requestsCount - 1);
    }
  };

  const handleSearch = async () => {
    if(searchQuery === "") {
      getAllSellers();
      return;
    }
    const response = await getAssigningSellers(searchQuery, pagination.page, pagination.limit);
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.result,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setSellers([...response.sellers]);
      setSearchQuery("")
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Total Products</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading sellers...
                </TableCell>
              </TableRow>
            ) : sellers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No sellers found
                </TableCell>
              </TableRow>
            ) : (
              sellers?.length > 0 &&
              sellers?.map((seller) => (
                <TableRow key={seller._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{seller.username}</div>
                        <div className="text-sm text-gray-500">
                          {seller.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="line-clamp-2">
                    {seller.company}
                  </TableCell>
                  <TableCell>
                    {seller.countryCode} {seller.phoneNumber}
                  </TableCell>
                  <TableCell>{seller.totalProducts}</TableCell>

                  <TableCell>{formatDate(seller?.createdAt)}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className="align-middle leading-4"
                      variant={seller.isActive ? "default" : "destructive"}
                    >
                      {seller.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  {/* Verified */}
                  <TableCell>
                    <Badge
                      className="align-middle leading-4"
                      variant={seller.isVerified ? "default" : "destructive"}
                    >
                      {seller.isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                        {seller.isVerified && (
                          <Button
                            className="hover:bg-primary cursor-pointer scale-75"
                            onClick={() => assignSeller(seller._id)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Assign Seller
                          </Button>
                        )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      <div className="">
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
          <p>{pagination.totalPages}</p>
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
  );
}
