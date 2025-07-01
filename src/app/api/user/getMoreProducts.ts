import axios from "axios";
import toast from "react-hot-toast";

export async function getMoreProducts(
    sellerId: string,
    page: number = 1,
    limit: number = 25
  ) {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "product/more/" + sellerId, {
        params: {
          page,
          limit
        },
        withCredentials: true
      });
      if (response.status === 200) {
        return {
            products: response.data.products,
            count: response.data.count,
            totalProducts: response.data.totalProducts,
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