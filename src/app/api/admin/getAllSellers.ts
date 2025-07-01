import axios from "axios";
import toast from "react-hot-toast";

export async function getUsers(
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "admin/users", {
      params: {
        page,
        limit
      },
      withCredentials: true
    }
    );
    if (response.status === 200) {
      return {
        sellers: response.data.usersData,
        result: response.data.count,
        total: response.data.totalUsers,
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

export async function toggleStatus(sellerId: string) {
  try {
    const response = await axios.put(process.env.NEXT_PUBLIC_SERVER_URL + `admin/user/${sellerId}`, {
    }, {
      withCredentials: true
    });
    if (response.status === 200) {
      toast.success(response.data.message || "Seller status updated successfully");
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

export async function removeSeller(sellerId: string) {
  try {
    const response = await axios.delete(process.env.NEXT_PUBLIC_SERVER_URL + `admin/user/${sellerId}/delete`, {
      withCredentials: true
    });
    if (response.status === 200) {
      toast.success(response.data.message || "Seller removed successfully");
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

export async function verifySellerById(sellerId: string) {
  try { 
    const response = await axios.put(process.env.NEXT_PUBLIC_SERVER_URL + `admin/user/${sellerId}/verify`, {
    }, {
      withCredentials: true
    });
    if (response.status === 200) {
      toast.success(response.data.message || "Seller has been verified successfully");
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

export async function filterSellersByStatus(
  status: "active" | "inactive",
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "admin/user/status", {
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
        sellers: response.data.usersData,
        result: response.data.count,
        total: response.data.totalUsers,
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
