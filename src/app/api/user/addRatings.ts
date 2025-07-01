import axios from "axios";
import toast from "react-hot-toast";

export async function addRatings(
  id: string,
  name: string,
  email: string,
  rating: number,
  comment: string,
) {
  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + `rating/add`,
      {
        id,
        name,
        email,
        rating,
        comment
      },{
      withCredentials: true
    });
    if (response.status === 201) {
      toast.success(response.data.message || "Ratings added successfully");
      return response.data.ratings;
    } else {
      toast.error(response.data.message || "Something went wrong");
      return null;
    }
  } catch (error: any) {
    toast.error(error.response.data.message || "Something went wrong");
    return null;
  }
}
