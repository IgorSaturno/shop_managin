import { DayOrdersAmountCard } from "@/components/dashboard/day-orders-amount-card";
import { MonthCanceledOrdersAmountCard } from "@/components/dashboard/month-canceled-orders-amount-card";
import { MonthOrdersAmountCard } from "@/components/dashboard/month-orders-amount-card";
import { MonthRevenueCard } from "@/components/dashboard/month-revenue-card";
import { PopularProductsChart } from "@/components/dashboard/popular-products-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

export function Dashboard() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <MonthRevenueCard />
          <MonthOrdersAmountCard />
          <DayOrdersAmountCard />
          <MonthCanceledOrdersAmountCard />
        </div>

        <div className="grid grid-cols-9 gap-4">
          <RevenueChart />
          <PopularProductsChart />
        </div>
      </div>
    </div>
  );
}
