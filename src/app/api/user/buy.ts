import axios from "axios";
import toast from "react-hot-toast";

export async function buyProduct(
    productId: string,
    name: string,
    contact: string,
    contactMethod: string,
    quantity: number,
    note: string,
) {
    try {
        
        const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + "buy/" + productId, {
            buyerName: name,
            buyerContact: contact,
            contactMethod: contactMethod,
            quantity,
            note,
            withCredentials: true
        });
        if (response.status === 201) {
            toast.success("Your request has been sent sent to the supplier so he will contact you soon or you can contact the supplier directly");
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


export async function updateOrderStatus(
    orderId: string,
    status: string
) {
    try {
        const response = await axios.put(process.env.NEXT_PUBLIC_SERVER_URL + "buy/" + orderId, {
            status,
        }, {
            withCredentials: true
        });
        if (response.status === 200) {
            toast.success(response.data.message || "Order status updated successfully");
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

export async function getOrders(
    page: number = 1,
    limit: number = 25,
    sortOrder: 'asc' | 'desc' = 'asc'
) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "buy", {
            params: {
                page,
                limit,
                sort: sortOrder
            },
            withCredentials: true
        });
        if (response.status === 200) {
            return {
                orders: response.data.buy,
                count: response.data.count,
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.totalBuy,
                totalPages: response.data.totalPages,
                usdToInrRate: response.data.usdToInrRate
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

export async function filterOrderStatus(
    status: "pending" | "completed" | "cancelled",
    page: number,
    limit: number
) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "buy/filter", {
            params: {
                status,
                page,
                limit
            },
            withCredentials: true
        });
        if (response.status === 200) {
            return {
                orders: response.data.orders,
                count: response.data.count,
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.totalBuy,
                totalPages: response.data.totalPages,
                usdToInrRate: response.data.usdToInrRate
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

export async function searchOrders(
    search: string,page: number,limit: number
) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "buy/" + search, {
            params: {
                page,
                limit
            },
            withCredentials: true
        });
        if (response.status === 200) {
            console.log(response.data);
            return {
                orders: response.data.orders,
                count: response.data.count,
                page: response.data.page,
                limit: response.data.limit,
                total: response.data.totalBuy,
                totalPages: response.data.totalPages,
                usdToInrRate: response.data.usdToInrRate
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