import { getDbUserId } from "@/lib/getCurrentUser";
import LoginPageClient from "./_component/LoginPageClient";
import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { createUrl } = await searchParams;
  const userId = await getDbUserId();
  if (userId) redirect("/dashboard");
  return <LoginPageClient createUrl={createUrl} />;
};

export default LoginPage;
