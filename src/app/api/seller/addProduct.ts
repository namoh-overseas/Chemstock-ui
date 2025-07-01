import axios from "axios";
import toast from "react-hot-toast";
import { ProductData } from "@/app/seller/add-product/page";

export async function addProduct(
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

    const response = await axios.post(
      `${serverUrl}seller/product/add`,
      dataToSend,
      headers
    );

    if (response.status === 201) {
      toast.success("Product added successfully");
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
