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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Mail,
  MoreHorizontal,
  Search,
  Trash,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  getUsers,
  removeSeller,
  filterSellersByStatus,
  toggleStatus,
  verifySellerById,
} from "@/app/api/admin/getAllSellers";
import redirect from "@/lib/redirect";
import { formatDate } from "@/components/product-ratings";


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

export default function SellerManagement() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
    setStatusFilter("");
    setSearchQuery("");
    getAllSellers();
  }, []);

  const deleteSeller = async (productId: string) => {
    if (
      confirm(
        `Are you sure you want to delete ${
          sellers.find((p) => p._id === productId)?.username
        }?`
      )
    ) {
      const response = await removeSeller(productId);
      if (response) {
        getAllSellers();
      }
    }
  };

  const verifySeller = async (sellerId: string) => {
    const response = await verifySellerById(sellerId);
    if (response) {
      const updatedSellers = sellers?.map((seller) => {
        if (seller._id === sellerId) {
          return { ...seller, isVerified: !seller.isVerified };
        }
        return seller;
      });
      setSellers(updatedSellers as Seller[]);
    }
  };

  const handleStatusFilter = async (status: string) => {
    setLoading(true);
    setStatusFilter(status);
    let response: any;
    if (status === "active" || status === "inactive") {
      response = await filterSellersByStatus(status, 1, 25);
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
    } else {
      getAllSellers();
    }
  };

  const handlePreviousPage = async () => {
    if (statusFilter) {
      const response = await filterSellersByStatus(
        statusFilter as "active" | "inactive",
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
    } else {
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
    }
  };

  const handleNextPage = async () => {
    if (statusFilter) {
      const response = await filterSellersByStatus(
        statusFilter as "active" | "inactive",
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
    } else {
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
    }
  };

  const toggleSellerStatus = async (sellerId: string, isActive: boolean) => {
    const stat = isActive === true ? false : true;
    const response = await toggleStatus(sellerId);
    if (response) {
      const updatedSellers = sellers?.map((seller) => {
        if (seller._id === sellerId) {
          return { ...seller, isActive: stat };
        }
        return seller;
      });
      setSellers(updatedSellers as Seller[]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Seller Management</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">

                        <DropdownMenuItem className="hover:bg-primary cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem  className="hover:bg-primary cursor-pointer"
                          onClick={() => redirect("mailto:" + seller.email)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        {!seller.isVerified && (
                          <DropdownMenuItem
                          className="hover:bg-primary cursor-pointer"
                            onClick={() => verifySeller(seller._id)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Verify Seller
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          className="hover:bg-primary cursor-pointer"
                          onClick={() =>
                            toggleSellerStatus(seller._id, seller.isActive)
                          }
                        >
                          {seller.isActive ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate Seller
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate Seller
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="hover:bg-primary cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => deleteSeller(seller._id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Seller
                        </DropdownMenuItem>
                        
                      </DropdownMenuContent>
                    </DropdownMenu>
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
