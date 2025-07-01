import axios from "axios";
import toast from "react-hot-toast";

export async function getAnalytics() {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/analytics", {
      withCredentials: true
    });
    if (response.status === 200) {
      return {
        isVerified: true,
        rating: response.data.rating,
        productsAnalytics: response.data.productsAnalytics,
        orderAnalytics: response.data.ordersAnalytics,
        ratedProducts: response.data.ratedProducts,
        usdToInrRate: response.data.usdToInrRate
      };
    } 
    else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong");
    return false;
  }
}