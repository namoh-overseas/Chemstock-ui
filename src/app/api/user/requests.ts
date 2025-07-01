import axios from "axios"
import toast from "react-hot-toast"

export async function getRequests(
    page: number = 1,
    limit: number = 25,
    sortOrder: 'asc' | 'desc' = 'asc'
) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/public/requests", {
            params: {
                page,
                limit,
                sort: sortOrder
            },
            withCredentials: true
        });
        if (response.status === 200) {
            return {
                requests: response.data.requests,
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

export async function searchRequests(
    search: string,page: number,limit: number
) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/public/requests/search/" + search, {
            params: {
                page,
                limit
            },
            withCredentials: true
        });
        if (response.status === 200) {
            console.log(response.data);
            return {
                requests: response.data.requests,
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

export async function getRequestsCount() {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/requests/count", {
            withCredentials: true
        });
        if (response.status === 200) {
            return response.data.totalRequests;
        } else {
            toast.error(response.data.message || "Something went wrong");
            return false;
        }
    } catch (error: any) {
        toast.error(error.response.data.message || "Something went wrong");
        return false;
    }
}

export async function getUserRequests(requests: string[]) {
    try {
        console.log(requests);
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/public/user/requests", {
            params: {
                requests
            },
            withCredentials: true
        });
        if (response.status === 200) {
            return {
                requests: response.data.requestsData,
                count: response.data.count,
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
