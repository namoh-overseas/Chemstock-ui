import axios from "axios";
import toast from "react-hot-toast";

export async function getSellerContact(productId: string) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/contact/" + productId, {
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