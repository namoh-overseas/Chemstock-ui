import axios from "axios";
import toast from "react-hot-toast";

export async function getFeaturedUsers(
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "product/featured/users", {
      params: {
        page,
        limit
      },
      withCredentials: true
    }
    );
    if (response.status === 200) {
      return {
        users: response.data.users,
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

export async function getTopSellers(
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "user/top/sellers", {
      params: {
        page,
        limit
      },
      withCredentials: true
    }
    );
    if (response.status === 200) {
      return {
        users: response.data.users,
        count: response.data.count,
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
