import { getUrlDetailsByShortUrl } from "@/actions/url.action";
import RedirectPageClient from "./_components/RedirectPageClient";

interface RediectPageProps {
  params: Promise<{
    shortUrl: string;
  }>;
}

const RedirectPage = async ({ params }: RediectPageProps) => {
  const { shortUrl } = await params;

  const urlDetails = await getUrlDetailsByShortUrl(shortUrl);

  return <RedirectPageClient urlDetails={urlDetails} />;
};

export default RedirectPage;
