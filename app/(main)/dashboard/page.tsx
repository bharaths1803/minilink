export const dynamic = "force-dynamic";

import { getDashboardData } from "@/actions/dashboard.action";
import DashboardPageClient from "./_components/DashboardPageClient";
import { getDbUserId } from "@/lib/getCurrentUser";

const DashboardPage = async () => {
  const userId = await getDbUserId();
  if (!userId) return;
  const dashboardData = await getDashboardData(userId);
  console.log("Dashboard data", dashboardData);
  return <DashboardPageClient dashboardData={dashboardData} />;
};

export default DashboardPage;
