"use client";

interface Analytics {
  // Total
  totalUsers: number;
  totalProducts: number;
  totalRequests: number;
  totalOrders: number;
  totalRevenue: number;
  
  // Normal
  completedOrders: number;
  completedRequests: number;
  cancelledOrders: number;
  cancelledRequests: number;

  // this month
  thisMonthUsers: number;
  thisMonthProducts: number;
  thisMonthRequests: number;
  thisMonthOrders: number;
  thisMonthRevenue: number;
  thisMonthCompletedOrders: number;
  thisMonthCompletedRequests: number;
  thisMonthCancelledOrders: number;
  thisMonthCancelledRequests: number;

  // Percentage
  thisMonthUsersPercentage: number;
  thisMonthProductsPercentage: number;
  thisMonthRequestsPercentage: number;
  thisMonthOrdersPercentage: number;
  thisMonthRevenuePercentage: number;
  completedOrdersPercentage: number;
  completedRequestsPercentage: number;
  cancelledOrdersPercentage: number;
  cancelledRequestsPercentage: number;
}

export default function Analytics({ analytics }: { analytics: Analytics }) {
  const formatRevenue = (value: number) => {
    if (value < 1000) {
      return value.toFixed(2);
    } else if (value < 1000000) {
      return (value / 1000).toFixed(2) + "K";
    } else if (value < 1000000000) {
      return (value / 1000000).toFixed(2) + "M";
    } else {
      return (value / 1000000000).toFixed(2) + "B";
    }
  };
  return (
    <div className="flex items-center justify-center text-gray-800 p-10">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Total */}
        <UpCard title="Total Users" value={analytics?.totalUsers} subtitle={`+ ${analytics?.thisMonthUsers} Registered this month`} percentage={analytics?.thisMonthUsersPercentage}/>
        <UpCard title="Total Products" value={analytics?.totalProducts} subtitle={`+ ${analytics?.thisMonthProducts} Added this month`} percentage={analytics?.thisMonthProductsPercentage}/>
        <UpCard title="Total Requests" value={analytics?.totalRequests} subtitle={`+ ${analytics?.thisMonthRequests} Requested this month`} percentage={analytics?.thisMonthRequestsPercentage}/>
        <UpCard title="Total Orders" value={analytics?.totalOrders} subtitle={`+ ${analytics?.thisMonthOrders} Placed this month`} percentage={analytics?.thisMonthOrdersPercentage}/>
        <UpCard title="Total Revenue" value={formatRevenue(analytics?.totalRevenue)} subtitle={`+ ${formatRevenue(analytics?.thisMonthRevenue)} Earned this month`} percentage={analytics?.thisMonthRevenuePercentage}/>
        {/* Normal */}
        <UpCard title="Completed Orders" value={analytics?.completedOrders} percentage={analytics?.completedOrdersPercentage} subtitle={`+ ${analytics?.thisMonthCompletedOrders} Completed this month`} />
        <UpCard title="Completed Requests" value={analytics?.completedRequests} percentage={analytics?.completedRequestsPercentage} subtitle={`+ ${analytics?.thisMonthCompletedRequests} Completed this month`} />
        <DownCard title="Cancelled Orders" value={analytics?.cancelledOrders} percentage={analytics?.cancelledOrdersPercentage} subtitle={`+ ${analytics?.thisMonthCancelledOrders} Cancelled this month`} />
        <DownCard title="Cancelled Requests" value={analytics?.cancelledRequests} percentage={analytics?.cancelledRequestsPercentage} subtitle={`+ ${analytics?.thisMonthCancelledRequests} Cancelled this month`} />
      </div>
    </div>
  );
}

const UpCard = ({
  title,
  value,
  percentage,
  subtitle,
}: {
  title: string;
  value: number | string;
  percentage?: number;
  subtitle?: string;
}) => {
  return (
    <div className="flex items-center p-4 rounded border border-gray-200 bg-slate-100">
      <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
        <svg
          className="w-6 h-6 fill-current text-green-700"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex-grow flex flex-col ml-4">
        <span className="text-xl font-bold">{title}</span>

        <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
          {value}
        </span>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">
            {subtitle && subtitle}
          </span>
          <span className="text-green-500 text-sm font-semibold ml-2">
           {percentage && <> +
            {isNaN(percentage || 0)
              ? "0"
              : percentage.toFixed(0) || 0}
            %</>}
          </span>
        </div>
      </div>
    </div>
  );
};


const DownCard = ({
  title,
  value,
  percentage,
  subtitle,
}: {
  title: string;
  value: number | string;
  percentage?: number;
  subtitle?: string;
}) =>{
  return (
    <div className="flex items-center p-4 rounded border border-gray-200 bg-slate-100">
          <div className="flex flex-shrink-0 items-center justify-center bg-red-200 h-16 w-16 rounded">
            <svg
              className="w-6 h-6 fill-current text-red-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">{title}</span>
            <span className="text-xl  font-semibold text-indigo-600 dark:text-indigo-400">
              {value}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">{subtitle && subtitle}</span>
              <span className="text-red-500 text-sm font-semibold ml-2">
                {percentage && "+" + (percentage.toFixed(0) || 0) + "%"}
              </span>
            </div>
          </div>
        </div>
  )
}