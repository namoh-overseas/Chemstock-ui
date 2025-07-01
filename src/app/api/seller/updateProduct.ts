import axios from "axios";
import toast from "react-hot-toast";
import { ProductData } from "@/app/seller/add-product/page";

export async function getProduct(id: string) {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `seller/product/${id}`, {
      withCredentials: true
    });
    if (response.status === 200) {
      return response.data.product;
    } else {
      toast.error(response.data.message || "Something went wrong");
      return null;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong");
    return null;
  }
}
export async function updateProduct(
  id: string,
  {
    name,
    description,
    price,
    currency,
    tone,
    ci,
    stock,
    stockUnit,
  }: ProductData,
  imageUrl: string | File
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
      formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("currency", currency);
      formData.append("tone", tone);
      formData.append("ci", ci);
      formData.append("stock", stock.toString());
      formData.append("stockUnit", stockUnit);
      formData.append("image", imageUrl); 

      dataToSend = formData;
      headers["headers"] = { "Content-Type": "multipart/form-data" };
    } else {
      dataToSend = {
        id,
        name,
        description,
        price,
        currency,
        tone,
        ci,
        stock,
        stockUnit,
        image: imageUrl,
      };
    }

    const response = await axios.put(
      `${serverUrl}seller/product/${id}`,
      dataToSend,
      headers
    );

    if (response.status === 200) {
      toast.success("Product updated successfully");
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
