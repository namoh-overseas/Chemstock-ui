import axios from "axios";
import toast from "react-hot-toast";

export async function removeProduct(id: string) {
  try {
    const response = await axios.delete(process.env.NEXT_PUBLIC_SERVER_URL + `seller/product/${id}`, {
      withCredentials: true
    });
    if (response.status === 200) {
      toast.success(response.data.message || "Product removed successfully");
      return true;
    }
    else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  }
  catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong");
    return false;
  }
}