import axios from "axios";
import toast from "react-hot-toast";

export async function addRequest(
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

    const response = await axios.post(
      `${serverUrl}seller/request/add`,
      dataToSend,
      headers
    );

    if (response.status === 201) {
      toast.success("Your Request has been recorded successfully");
      return response.data.request._id;
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

export async function getRequests(page: number = 1, limit: number = 25) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/requests", {
      params: {
        page,
        limit
      },
      withCredentials: true
    }
    );
    if (response.status === 200) {
      return {
        orders: response.data.requests,
        count: response.data.count,
        total: response.data.total,
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

export async function updateRequestStatus(
  orderId: string,
  status: string
) {
  try {
      const response = await axios.put(process.env.NEXT_PUBLIC_SERVER_URL + "seller/request/" + orderId, {
          status,
      }, {
          withCredentials: true
      });
      if (response.status === 200) {
          toast.success(response.data.message || "Request status updated successfully");
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