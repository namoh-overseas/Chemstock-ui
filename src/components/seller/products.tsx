"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FallbackImage from "@/lib/imgLoader";
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
import { Eye, MoreHorizontal, Pencil, Search, Trash } from "lucide-react";
import {
  getProducts,
  filterProductsByStatus,
  toggleProductStatus,
  filterProductsByVisibility,
} from "@/app/api/seller/getProducts";
import { removeProduct } from "@/app/api/seller/removeProduct";
import redirect from "@/lib/redirect";
import { searchProducts } from "@/app/api/seller/getProducts";

interface Product {
  _id: string;
  name: string;
  price: number;
  currency: "INR" | "USD";
  stock: number;
  stockUnit: "kg" | "grm" | "mg" | "ml" | "ltr" | "pcs" | "mts";
  image: string;
  description: string;
  tone: string;
  ci: string;
  status: "active" | "inactive";
  sales: number;
  isVisible: boolean;
  isVerified: boolean;
  isFeatured: boolean;
}

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    result: 0,
  });

  const getAllProducts = async (page: number = 1, limit: number = 25) => {
    const response = await getProducts(page, limit);
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.result,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setProducts([...response.products]);
      setLoading(false);
    }
  };

  useEffect(() => {
    setStatusFilter("");
    setVisibilityFilter("");
    setSearchQuery("");
    getAllProducts();
  }, []);

  const handleStatusFilter = async (status: string) => {
    setLoading(true);
    setVisibilityFilter("");
    setStatusFilter(status);
    let response: any;
    if (status === "active" || status === "inactive") {
      response = await filterProductsByStatus(status, 1, 25);
      if (response) {
        setPagination((prev) => ({
          ...prev,
          result: response.result,
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        }));
        setProducts([...response.products]);
        setLoading(false);
      }
    } else {
      getAllProducts();
    }
  };

  const handleVisibilityFilter = async (visible: string) => {
    setLoading(true);
    setStatusFilter("");
    setVisibilityFilter(visible);
    let response: any;
    if (visible === "visible" || visible === "hidden") {
      response = await filterProductsByVisibility(visible === "visible", 1, 25);
      if (response) {
        setPagination((prev) => ({
          ...prev,
          result: response.result,
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        }));
        setProducts([...response.products]);
        setLoading(false);
      }
    } else {
      getAllProducts();
    }
  };

  const toggleStatus = async (
    productId: string,
    status: "active" | "inactive"
  ) => {
    const stat = status === "active" ? "inactive" : "active";
    const response = await toggleProductStatus(productId, stat);
    if (response) {
      const updatedProducts = products?.map((product) => {
        if (product._id === productId) {
          return { ...product, status: stat };
        }
        return product;
      });
      setProducts(updatedProducts as Product[]);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (
      confirm(
        `Are you sure you want to delete ${
          products.find((p) => p._id === productId)?.name
        }?`
      )
    ) {
      const response = await removeProduct(productId);
      if (response) {
        getAllProducts();
      }
    }
  };

  const handlePreviousPage = async () => {
    if (statusFilter) {
      const response = await filterProductsByStatus(
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
        setProducts([...response.products]);
      }
    } else if (visibilityFilter) {
      const response = await filterProductsByVisibility(
        visibilityFilter === "visible",
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
          totalPages: response.totalPages
    }));
        setProducts([...response.products]);
      }
    } else {
      const response = await getProducts(
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
        setProducts([...response.products]);
      }
    }
  };

  const handleNextPage = async () => {
    if (statusFilter) {
      const response = await filterProductsByStatus(
        statusFilter as "active" | "inactive",
        pagination.page + 1 > pagination.totalPages ? pagination.totalPages : pagination.page,
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
        setProducts([...response.products]);
      }
    } else if (visibilityFilter) {
      const response = await filterProductsByVisibility(
        visibilityFilter === "visible",
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
        setProducts([...response.products]);
      }
    } else {
      const response = await getProducts(
        pagination.page + 1 > pagination.totalPages ? pagination.totalPages : pagination.page, pagination.limit);
      if (response) {
        setPagination((prev) => ({
          ...prev,
          result: response.result,
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        }));
        setProducts([...response.products]);
      }
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    if(searchQuery === '') {
      getAllProducts();
      return;
    }
    const response = await searchProducts(searchQuery);
    if (response) {
      setPagination((prev) => ({
        ...prev,
        result: response.result,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }));
      setProducts([...response.products]);
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">My Products</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button asChild>
            <Link href="/seller/add-product">Add Product</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
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
          <div className="w-full md:w-auto">
            <Select
              value={visibilityFilter}
              onValueChange={handleVisibilityFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visibility</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>CI</TableHead>
              <TableHead>Tone</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>currency</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Sold Units</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Link href={`/products/${product._id}`}>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                          <FallbackImage
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            height={50}
                            width={50}
                            className="object-cover size-full"
                            priority
                          />
                        </div>
                        <div className="font-medium line-clamp-2">
                          <sub className="text-xs text-gray-400 block">
                            {product._id}
                          </sub>
                          {product.name}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{product.ci}</TableCell>
                  <TableCell>{product.tone}</TableCell>
                  <TableCell>
                    {product.currency === "INR" ? "₹" : "$"}
                    {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>{product.currency}</TableCell>
                  <TableCell className="capitalize">
                    <Badge
                    className={product.stock < 10 ? "bg-red-100 text-red-600 border-red-600 align-middle leading-4" : "bg-gray-200"}
                    >
                      {product.stock} {product.stockUnit}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <pre
                      className="line-clamp-2 whitespace-pre-wrap"
                      title={product.description}
                    >
                      {product.description || <Badge className="bg-amber-100 text-amber-600 border-amber-600 align-middle leading-4">Not Available</Badge>}
                    </pre>
                  </TableCell>
                  <TableCell className="capitalize">
                    <Badge
                    className={product.sales < 10 ? "bg-amber-100 text-amber-600 border-amber-600 align-middle leading-4" : "bg-gray-200 align-middle leading-4"}
                    >
                      {product.sales} {product.stockUnit}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-center capitalize"
                      variant={
                        product.status === "active" ? "default" : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.isVisible ? "default" : "secondary"}
                    >
                      {product.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="align-middle leading-4"
                      variant={
                        product.isVerified ? "default" : "destructive"
                      }
                    >
                      {product.isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="align-middle leading-4"
                      variant={
                        product.isFeatured ? "default" : "secondary"
                      }
                    >
                      {product.isFeatured ? "Featured" : "Not Featured"}
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
                          onClick={() => redirect("/products/" + product._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/seller/add-product/${product._id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toggleStatus(product._id, product.status)
                          }
                        >
                          {product.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteProduct(product._id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className=""></div>
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
            className="h-9 w-12 text-center px-0.5 border-2 font-bold"            disabled={pagination.totalPages <= 1}
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
