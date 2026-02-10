import DashboardHeader from "../../components/DashboardHeader";
import StatsCards from "../../components/StatsCard";
import ChartsSection from "../../components/ChartsSection";
import  RecentSalesTable from "../../components/RecentSalesTable";

export default function MainScreen() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      
      {/* Header */}
      <DashboardHeader />

      {/* Top Stats Cards */}
      <StatsCards />

      {/* Charts */}
      <ChartsSection />

      {/* Recent Sales Table */}
      <RecentSalesTable />

    </div>
  );
}
