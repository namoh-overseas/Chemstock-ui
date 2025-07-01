"use client"
import { useStore } from "@/store";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useEffect, useState } from "react";
export default function SellerInfo() {
    const { user } = useStore();
    const [isVerified, setIsVerified] = useState(false);

    const getUserVerificationStatus = async () => {
        const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + "seller/verification-status", {
            withCredentials: true,
        });
        if (response.status === 200) {
            setIsVerified(response.data.isVerified);
        }
    };
    useEffect(() => {
        if (user) {
            getUserVerificationStatus();
        }
    }, [user]);
    return (
        <section>
            {user && (
                <>
                    <div className="bg-white overflow-hidden shadow rounded-lg border my-4 w-fit">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Seller Profile
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                This is some information about the seller.
                            </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Full name
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.username}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Email address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.email}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Phone number
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.phoneNumber}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-wrap">
                                        {user.address || "Not provided"}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Speciality
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-wrap">
                                        {user.speciality[0] ? user.speciality[0].replace(/,/g, ', ').split(',').map((sp, i) => (
                                            <Badge key={i} variant="outline">
                                                {sp}
                                            </Badge>
                                        ))
                                    : "Not provided"}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Role
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user.role}
                                    </dd>
                                </div>
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Status
                                    </dt>
                                    <dd className="mt-1 text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        <Badge className="align-middle leading-4" variant={user.isActive ? "default" : "destructive"}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </dd>
                                </div>

                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Verified
                                    </dt>
                                    <dd className="text-sm capitalize text-gray-900 sm:mt-0 sm:col-span-2">
                                        <Badge className="align-middle leading-4" variant={isVerified ? "default" : "destructive"}>
                                            {isVerified ? "Verified" : "Not Verified"}
                                        </Badge>
                                    </dd>
                                </div>
                                
                                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Description
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-wrap">
                                        {user.description || "Not provided"}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}

