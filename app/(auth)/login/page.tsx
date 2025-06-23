import LoginPageClient from "./_component/LoginPageClient";

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { createUrl } = await searchParams;
  return <LoginPageClient createUrl={createUrl} />;
};

export default LoginPage;
