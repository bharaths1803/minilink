import { getDashboardData } from "@/actions/dashboard.action";
import DashboardPageClient from "./_components/DashboardPageClient";
import { getDbUserId } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const { createUrl } = await searchParams;
  const userId = await getDbUserId();
  if (!userId) redirect("/login");
  const dashboardData = await getDashboardData(userId);
  return (
    <DashboardPageClient
      dashboardData={dashboardData}
      createUrl={createUrl || ""}
    />
  );
};

export default DashboardPage;
