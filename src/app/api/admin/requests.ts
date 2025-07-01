import axios from "axios";
import toast from "react-hot-toast";

export async function getRequests(page: number = 1, limit: number = 25) {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "admin/requests",
      {
        params: {
          page,
          limit,
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      // toast.success(response.data.message || "Requests fetched successfully");
      return {
        orders: response.data.requests,
        count: response.data.count,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
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

export async function getRequestById(requestId: string) {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + `admin/request/${requestId}`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return response.data.request;
    } else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong");
    return false;
  }
}

export async function verifyRequestById(productId: string) {
  try {
    const response = await axios.put(
      process.env.NEXT_PUBLIC_SERVER_URL + `admin/request/${productId}/verify`,
      {},
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      toast.success(
        response.data.message || "Product has been verified successfully"
      );
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

export async function getUsers(
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "admin/request/users", {
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

export async function assignSellerById(sellerId: string, requestId: string) {
  try {
    const response = await axios.put(
      process.env.NEXT_PUBLIC_SERVER_URL + `admin/request/${requestId}/assign/${sellerId}`,
      {},
      {
        withCredentials: true,
      }
    );
    if (response.status === 200 || response.status === 201) {
      toast.success(
        response.data.message || "Seller has been assigned successfully"
      );
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

export async function updateRequest(
  requestId: string,
  {
    name,
    quantity,
    stockUnit,
    ci,
    tone,
    contact,
    contactMethod,
    description,
  }: {
    name: string;
    quantity: number;
    stockUnit: string;
    ci?: string;
    tone?: string;
    contact: string;
    contactMethod: "whatsapp" | "phone" | "email";
    description?: string;
  },
  imageUrl?: string | File,
) {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      toast.error("Server URL is not defined");
      return false;
    }

    let dataToSend: any;
    let headers: any = {
      withCredentials: true,
    };

    if (imageUrl instanceof File) {
      const formData = new FormData();
      formData.append("_id", requestId);
      formData.append("name", name);
      formData.append("note", description || "");
      formData.append("quantity", quantity.toString());
      formData.append("stockUnit", stockUnit);
      formData.append("ci", ci || "");
      formData.append("tone", tone || "");
      formData.append("contact", contact);
      formData.append("contactMethod", contactMethod);
      formData.append("image", imageUrl);

      dataToSend = formData;
      headers["headers"] = { "Content-Type": "multipart/form-data" };
    } else {
      dataToSend = {
        _id: requestId,
        name,
        quantity,
        stockUnit,
        ci,
        tone,
        contact,
        contactMethod,
        note: description,
        image: imageUrl,
      };
    }

    const response = await axios.put(
      `${serverUrl}admin/request/${requestId}/update`,
      dataToSend,
      headers
    );

    if (response.status === 200 || response.status === 201) {
      toast.success(name + " has been updated successfully");
      return true;
    } else {
      toast.error(response.data.message || "Something went wrong");
      return false;
    }
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    toast.error(errMsg);
    return false;
  }
}

export async function getAssigningSellers(
  searchQuery: string = "",
  page: number = 1,
  limit: number = 25
) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "admin/user/search/" + searchQuery, {
      params: {
        page,
        limit
      },
      withCredentials: true
    }
    );
    if (response.status === 200) {
      return {
        sellers: response.data.users,
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