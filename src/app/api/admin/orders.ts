import axios from "axios"
import toast from "react-hot-toast"

export async function getOrders(
    page: number = 1,
    limit: number = 25,
    sortOrder: 'asc' | 'desc' = 'asc'
) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "admin/orders", {
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

export async function searchOrders(
    search: string,page: number,limit: number
) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "admin/orders/search/" + search, {
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

export async function filterOrderStatus(
    status: "pending" | "completed" | "cancelled",
    page: number,
    limit: number
) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "admin/orders/filter/" + status, {
            params: {
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