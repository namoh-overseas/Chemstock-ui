import axios from "axios";
import toast from "react-hot-toast";

export async function getProduct(id: string) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `product/product/${id}`, {
      withCredentials: true
    });
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(response.data.message || "Something went wrong");
      return null;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong");
    return null;
  }
}

export async function getProducts(
  url: string
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "product" + url, {
      withCredentials: true
    });
    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong");
    return false;
  }
}

export async function getFeaturedProducts(
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "product/featured/products", {
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
        totalPages: response.data.totalPages,
        usdToInrRate: response.data.usdToInrRate
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