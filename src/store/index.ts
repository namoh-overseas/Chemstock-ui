import { create } from "zustand"
import { persist } from "zustand/middleware"
import toast from "react-hot-toast"
import axios from "axios"
import redirect from "@/lib/redirect"

export type User = {
  id: string,
  username: string,
  email: string,
  countryCode: string,
  phoneNumber: string,
  company: string,
  address: string,
  description: string,
  speciality: string,
  role: string,
  isActive: boolean,
  isVerified: boolean,
}

// Store types
type StoreState = {
  user: User | null
  requests: string[]
  currency: "USD" | "INR"
  isAuthenticated: boolean
  requestsCount: number
  isLoggedIn: boolean

  // Actions
  register: (
    username: string,
    email: string,
    password: string,
    country: string,
    phoneNumber: string,
    company: string,
    description: string,
    speciality: string,
  ) => void
  login: (
    email: string, password: string
  ) => void
  logout: () => void;
  getUser: () => void;
  setRequestsCount: (count: number) => void;
  switchCurrency: (currency: string) => void;
  setRequests: (request: string) => void;
}

// Create store
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      requests: [],
      currency: "INR",
      isAuthenticated: false,
      requestsCount: 0,
      isLoggedIn: false,
      setRequestsCount: (count) => {
        set({ requestsCount: count })
      },

      setRequests: (request: string) => {
        const { requests } = get();
        set({ requests: [...requests, request]})
      },

      getUser: () => {
        const { user } = get();
        return user
      },

      register: async (
        username,
        email,
        password,
        country,
        phoneNumber,
        company,
        description,
        speciality,
      ) => {
        try {
          const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + "user/register", {
            username,
            email,
            password,
            countryCode: country,
            phoneNumber,
            company,
            description,
            speciality,
          },{
            withCredentials: true,
          })
          if (response.status === 201) {
            toast.success("User registered successfully")
            set({ user: null });
            set({ user: response.data });
            set({ isAuthenticated: true });
            set({ isLoggedIn: true });
            toast.loading("Redirecting...")
            setTimeout(() => {
              toast.dismiss()
            }, 2000)
            redirect("/seller", { delayMs: 2000 })
          }
        } catch (error: any) {
          if(error.response.status === 409) {
            toast.error(error.response.data.message + ". Please login")
            setTimeout(() => {
              redirect("/seller");
            }, 2000)
          }
          toast.error(error.response.data.message || "Something went wrong")
        }
      },

      login: async (email, password) => {
        try {
          const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + "user/login", {
            email,
            password,
          },{
            withCredentials: true,
          })
          if (response.status === 200) {
            toast.success("User logged in successfully")
            set({ user: response.data });
            set({ isAuthenticated: true });
            set({ isLoggedIn: true });
            // redirect("/seller", { delayMs: 2000 })
          }
        } catch (error: any) {
          if(error.response.status === 401) {
            toast.error(error.response.data.message)
          }
          toast.error(error.response.data.message || "Something went wrong")
        }
      },

      logout: async () => {
        try {
          const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + "user/logout", {}, {
            withCredentials: true,
          })
          set({ user: null });
          set({ isAuthenticated: false });
          if (response.status === 200) {
            toast.success("User logged out successfully")
            toast.loading("Redirecting...")
          }
          redirect("/")
          setTimeout(() => {
            toast.dismiss()
          }, 2000)
        } catch (error: any) {
          
          toast.error(error.response.data.message || "Something went wrong")
        }
      },

      switchCurrency: async (currency) => {
        set({ currency: currency as "USD" | "INR" })
      }

    }),
    {
      name: "chemstock-storage",
      partialize: (state) => ({
        user: state.user,
        currency: state.currency,
        requests: state.requests,
        isAuthenticated: state.isAuthenticated,
        requestsCount: state.requestsCount,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
)
