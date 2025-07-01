import axios from "axios";
import toast from "react-hot-toast";

export async function getProducts(
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/products", {
      params: {
        page,
        limit
      },
      withCredentials: true
    }
    );
    if (response.status === 200) {
      return {
        products: response.data.products,
        result: response.data.count,
        total: response.data.totalProducts,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages
      };
    } else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong");
    return false;
  }
}

export async function filterProductsByStatus(
  status: "active" | "inactive",
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/products/status", {
      params: {
        status,
        page,
        limit
      },
      withCredentials: true
    }
    );
    if (response.status === 200) {
      return {
        products: response.data.products,
        result: response.data.count,
        total: response.data.totalProducts,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages
      };
    } else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {

    toast.error(error.response.data.message || "Something went wrong");
    return false;
  }
}

export async function toggleProductStatus(productId: string, status: "active" | "inactive") {
  try {
    const response = await axios.put(process.env.NEXT_PUBLIC_SERVER_URL + `seller/product/${productId}/status`, {
      status
    }, {
      withCredentials: true
    });
    if (response.status === 200) {
      toast.success(response.data.message || "Product status updated successfully");
      return true;
    } else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong");
    return false;
  }
}

export async function filterProductsByVisibility(
  visible: boolean,
  page: number = 1, 
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/products/visibility", {
      params: {
        visible,
        page,
        limit
      }
      ,
      withCredentials: true
    }
    );
    if (response.status === 200) {
      return {
        products: response.data.products,
        result: response.data.count,
        total: response.data.totalProducts,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages
      };
    } else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {

    toast.error(error.response.data.message || "Something went wrong");
    return false;
  }
}

export async function searchProducts(
  search: string,
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/products/search",
      {
        params: { search, page, limit },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return {
        products: response.data.products,
        result: response.data.count,
        total: response.data.totalProducts,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages
      };
    } else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {

    toast.error(error.response.data.message || "Something went wrong");
    return false;
  }
}