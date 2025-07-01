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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Search, Trash, UserCheck } from "lucide-react";
import FallbackImage from "@/lib/imgLoader";
import Link from "next/link";

import {
  getProducts,
  toggleProductVisibility,
  removeProduct,
  addfeaturedProduct,
} from "@/app/api/admin/getAllProducts";

import {
  filterProductsByStatus,
  filterProductsByVisibility,
} from "@/app/api/seller/getProducts";
import redirect from "@/lib/redirect";
import { searchProducts } from "@/app/api/seller/getProducts";
import { verifyProductById } from "@/app/api/admin/getAllProducts";

interface Product {
  _id: string;
  name: string;
  price: number;
  currency: "INR" | "USD";
  ci:string;
  tone:string;
  stock: number;
  stockUnit: "kg" | "grm" | "mg" | "ml" | "ltr" | "pcs" | "mts";
  image: string;
  status: "active" | "inactive";
  sales: number;
  seller: {
    _id: string;
    username: string;
  };
  isVisible: boolean;
  isFeatured: boolean;
  isVerified: boolean;
}

export default function ProductManagement() {
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

  const toggleVisibility = async (productId: string, visible: boolean) => {
    const stat = visible;
    const response = await toggleProductVisibility(productId);
    if (response) {
      const updatedProducts = products?.map((product) => {
        if (product._id === productId) {
          return { ...product, isVisible: !stat };
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

  const verifyProduct = async (productId: string) => {
      const response = await verifyProductById(productId);
      if (response) {
        const updatedProducts = products?.map((product) => {
          if (product._id === productId) {
            return { ...product, isVerified: !product.isVerified };
          }
          return product;
        });
        setProducts(updatedProducts as Product[]);
      }
    };

  const togglefeaturedProduct = async (productId: string) => {
    const response = await addfeaturedProduct(productId);
    if (response) {
      const updatedProducts = products?.map((product) => {
        if (product._id === productId) {
          return { ...product, isFeatured: !product.isFeatured };
        }
        return product;
      });
      setProducts(updatedProducts as Product[]);
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
          totalPages: response.totalPages,
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
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    if (searchQuery === "") {
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
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search products..."
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

      <div className="flex flex-wrap gap-4">
        {/* <div className="w-full md:w-auto">
          <Select value={sellerFilter} onValueChange={setSellerFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Sellers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sellers</SelectItem>
              {sellers.map((seller) => (
                <SelectItem key={seller} value={seller}>
                  {seller}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        {/* <div className="w-full md:w-auto">
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="visible">Visible Only</SelectItem>
              <SelectItem value="hidden">Hidden Only</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>CI Number</TableHead>
              <TableHead>Product Tone</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>currency</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Sold Units</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Is Verified</TableHead>
              <TableHead>Featured</TableHead> 
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
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
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.currency}</TableCell>
                  <TableCell className="capitalize">{product.stock} {product.stockUnit}</TableCell>
                  <TableCell className="capitalize">{product.sales} {product.stockUnit}</TableCell>
                  <TableCell>{product.seller?.username}</TableCell>
                  <TableCell>
                    <Badge
                      className="align-middle leading-4"
                     variant={product.isVisible ? "default" : "destructive"}>
                      {!product.isVisible ? "Hidden" : "Visible"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="align-middle leading-4 capitalize"
                      variant={
                        product.status === "active" ? "default" : "destructive"
                      }
                    >
                      {product.status}
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

                  {/* Actions */}
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
                          <Link href={`/admin/product/${product._id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Product
                          </Link>
                        </DropdownMenuItem>
                        {!product.isVerified && (
                          <DropdownMenuItem
                          className="hover:bg-primary cursor-pointer"
                            onClick={() => verifyProduct(product._id)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Verify Product
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => togglefeaturedProduct(product._id)}
                        >
                          {product.isFeatured
                            ? "remove from featured"
                            : "add to featured"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        // onClick={() => toggleVisibility(product._id)}
                        >
                          {!product.isVisible ? (
                            <div
                              onClick={() =>
                                toggleVisibility(product._id, false)
                              }
                            >
                              Show Product
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                toggleVisibility(product._id, true)
                              }
                            >
                              Hide Product
                            </div>
                          )}
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
