"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, Filter, SortAsc, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { getProducts } from "@/app/api/user/getProducts";
import ProductCard from "./product-card";
import { Skeleton } from "./ui/skeleton";
import { useSize} from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface FilterState {
  company: string[];
  priceRange: [number, number];
  stockRange: [number, number];
}

export interface ProductItem {
  _id: string;
  name: string;
  price: number;
  currency: "INR" | "USD";
  description: string;
  stock: number;
  stockUnit: "kg" | "grm" | "mg" | "ml" | "ltr" | "pcs" | "mts";
  image: string;
  tone: string;
  ci: string;
  seller: {
    id: string;
    username: string;
    company: string;
  };
  isFeatured: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  count: number;
}

export default function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxStock, setMaxStock] = useState(100);
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [usdToInrRate, setUsdToInrRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    count: 0,
  });

  const size = useSize();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    company: [],
    priceRange: [0, maxPrice],
    stockRange: [0, maxStock],
  });
  // Build the complete API URL
  const buildApiUrl = () => {
    let params = "";

    // Add search parameter
    if (searchQuery.trim()) {
      params += `search=${searchQuery.trim()}`;
    }

    // Build filters string
    const filterParts: string[] = [];

    // Array filters
    if (filters.company.length > 0) {
      filterParts.push(`company:${filters.company.join(",")}`);
    }

    // Range filters
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) {
      filterParts.push(
        `price:${filters.priceRange[0]}-${filters.priceRange[1]}`
      );
    }
    if (filters.stockRange[0] > 0 || filters.stockRange[1] < maxStock) {
      filterParts.push(
        `stock:${filters.stockRange[0]}-${filters.stockRange[1]}`
      );
    }

    if (filterParts.length > 0) {
      if (searchQuery.trim()) {
        params += `&`;
      }
      params += `filters=${filterParts.join(";")}`;
    }

    // Add sort parameter
    if (searchQuery.trim() || filterParts.length > 0) {
      params += `&`;
    }
    params += `sort=${sortBy}-${sortOrder}`;

    return `?${params}`;
  };

  const getData = async () => {
    console.log(url);
    try {
      setLoading(true);
      const response = await getProducts(
        url +
          (url.includes("?") ? "&" : "?") +
          `page=${pagination.page}&limit=${pagination.limit}`
      );
      if (response) {
        setProducts(response.products);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
          count: response.count,
        });
        setTotalProducts(response.total);
        setUsdToInrRate(response.usdToInrRate);
        setAvailableCompanies(response.companies);
        setMaxPrice(response.maxPrice);
        setMaxStock(response.maxStock);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUrl(buildApiUrl());
    getData();
  }, []);

  useEffect(() => {
    setUrl(buildApiUrl());
  }, [
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    pagination.page,
    pagination.limit,
  ]);

  if (!isMounted) return null;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleArrayFilterChange = (
    key: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const currentArray = filters[key] as string[];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);
    handleFilterChange(key, newArray);
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
    setUrl(buildApiUrl());
    getData();
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      company: [],
      priceRange: [0, maxPrice],
      stockRange: [0, maxStock],
    };
    setFilters(clearedFilters);

    getData();
  };

  const getActiveFilterCount = () => {
    let count = 0;

    // Count array filters
    count += filters.company.length;

    // Count range filters
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    if (filters.stockRange[0] > 0 || filters.stockRange[1] < maxStock) count++;

    return count;
  };

  return (
    <div className="space-y-4 p-4 bg-background border-b">
      {!products ||
        (products?.length >= 0 && (
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative flex items-center gap-2">
              <div className="w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getData();
                    }
                  }}
                  className="pl-10 pr-4"
                />
              </div>
              <Button
                onClick={() => {
                  getData();
                }}
                variant="outline"
                className="gap-1.5 flex items-center bg-primary"
              >
                <Search className="text-muted-foreground h-4 w-4" />
                <span className="relative top-0.5">Search</span>
              </Button>
            </div>

            {/* Filters and Sort Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80 z-50 max-h-[65vh] overflow-y-auto"
                  align="start"
                >
                  <div className="flex items-center justify-between p-2">
                    <DropdownMenuLabel>Filter Stocks</DropdownMenuLabel>
                    <Button
                      onClick={() => {
                        getData();
                      }}
                      variant="default"
                      size="sm"
                      className="h-auto rounded p-1 py-2 text-xs leading-2"
                    >
                      Apply Filters
                    </Button>
                  </div>
                  <DropdownMenuSeparator />

                  {/* Price Range Filter */}
                  <div className="p-4">
                    <Label className="text-sm font-medium">Price Range</Label>
                    <div className="mt-2 space-y-3">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "priceRange",
                            value as [number, number]
                          )
                        }
                        max={maxPrice}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>₹{filters.priceRange[0]}</span>
                        <span>₹{filters.priceRange[1]}</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.priceRange[0]}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value) || 0;
                            handleFilterChange("priceRange", [
                              value,
                              filters.priceRange[1],
                            ]);
                          }}
                          className="h-8 text-xs"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.priceRange[1]}
                          onChange={(e) => {
                            const value =
                              Number.parseInt(e.target.value) || maxPrice;
                            handleFilterChange("priceRange", [
                              filters.priceRange[0],
                              value,
                            ]);
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Stock Range Filter */}
                  <div className="p-4">
                    <Label className="text-sm font-medium">Stock Range</Label>
                    <div className="mt-2 space-y-3">
                      <Slider
                        value={filters.stockRange}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "stockRange",
                            value as [number, number]
                          )
                        }
                        max={maxStock}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{filters.stockRange[0]}</span>
                        <span>{filters.stockRange[1]}</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.stockRange[0]}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value) || 0;
                            handleFilterChange("stockRange", [
                              value,
                              filters.stockRange[1],
                            ]);
                          }}
                          className="h-8 text-xs"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.stockRange[1]}
                          onChange={(e) => {
                            const value =
                              Number.parseInt(e.target.value) || maxStock;
                            handleFilterChange("stockRange", [
                              filters.stockRange[0],
                              value,
                            ]);
                          }}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {availableCompanies?.length > 0 && (
                    <>
                      <DropdownMenuSeparator />

                      {/* Company Filter */}
                      <div className="p-2 max-h-64 overflow-y-auto">
                        <div className="font-medium text-sm mb-2">Company</div>
                        {availableCompanies?.map((company) => (
                          <DropdownMenuCheckboxItem
                            key={company}
                            checked={filters.company.includes(company)}
                            onCheckedChange={(checked) =>
                              handleArrayFilterChange(
                                "company",
                                company,
                                checked
                              )
                            }
                          >
                            {company}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-48">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevant-asc">Relevant</SelectItem>
                  <SelectItem value="name-desc">Name: A to Z</SelectItem>
                  <SelectItem value="name-asc">Name: Z to A</SelectItem>
                  <SelectItem value="price-desc">Price: Low to High</SelectItem>
                  <SelectItem value="price-asc">Price: High to Low</SelectItem>
                  <SelectItem value="stock-desc">Stock: Low to High</SelectItem>
                  <SelectItem value="stock-asc">Stock: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground ml-auto">
                {totalProducts} products found
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFilterCount() > 0 && (
              <div className="flex flex-wrap gap-2">
                {/* Price Range Badge */}
                {(filters.priceRange[0] > 0 ||
                  filters.priceRange[1] < maxPrice) && (
                  <Badge variant="secondary" className="gap-1">
                    Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleFilterChange("priceRange", [0, maxPrice])
                      }
                    />
                  </Badge>
                )}

                {/* Stock Range Badge */}
                {(filters.stockRange[0] > 0 ||
                  filters.stockRange[1] < maxStock) && (
                  <Badge variant="secondary" className="gap-1">
                    Stock: {filters.stockRange[0]} - {filters.stockRange[1]}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleFilterChange("stockRange", [0, maxStock])
                      }
                    />
                  </Badge>
                )}

                {filters.company.map((company) => (
                  <Badge
                    key={`company-${company}`}
                    variant="secondary"
                    className="gap-1"
                  >
                    Company: {company}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleArrayFilterChange("company", company, false)
                      }
                    />
                  </Badge>
                ))}
                {getActiveFilterCount() > 0 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-auto rounded p-1 text-xs leading-2"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      {!products ||
        (products?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters</p>
          </div>
        ))}

      <div className={cn("grid gap-6", 
        size === "xs" && "grid-cols-1",
        size === "sm" && "grid-cols-2",
        size === "md" && "grid-cols-2",
        size === "lg" && "grid-cols-3",
        size === "xl" && "grid-cols-4")}>
        {
          loading ? (
            <Suspense fallback={<ProductListSkeleton />}>
                {products?.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    usdToInrRate={usdToInrRate}
                  />
                ))}
            </Suspense> 
          ) : (
            products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                usdToInrRate={usdToInrRate}
              />
            ))
          )}
      </div>
    </div>
  );
}



function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
    </div>
  );
}