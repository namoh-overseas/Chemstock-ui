import axios from "axios";
import toast from "react-hot-toast";

export async function getUsdToInrRate() {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "admin/settings", {
        withCredentials: true
      }
      );
      if (response.status === 200) {
        return response.data.usdToInrRate;
      } else {
        toast.error(response.data.message || "Something went wrong");
        return false;
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Something went wrong");
      return false;
    }
  }
  
  export async function updateUsdToInrRate(rate: number) {
    try {
      const response = await axios.put(process.env.NEXT_PUBLIC_SERVER_URL + "admin/settings", {
        usdToInrRate: rate
      }, {
        withCredentials: true
      }
      );
      if (response.status === 200) {
        toast.success(response.data.message || "USD to INR rate updated successfully");
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