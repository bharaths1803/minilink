import {
  getDeviceDetails,
  getLocationDetails,
  getUrlDetails,
} from "@/actions/url.action";
import LinkPageClient from "../_components/LinkPageClient";
import { getDbUserId } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

interface LinkPageProps {
  params: Promise<{
    linkId: string;
  }>;
}

const LinkPage = async ({ params }: LinkPageProps) => {
  const userId = await getDbUserId();
  if (!userId) redirect("/login");
  const { linkId } = await params;
  const urlDetails = await getUrlDetails(linkId);
  const deviceData = await getDeviceDetails(linkId);
  const locationData = await getLocationDetails(linkId);

  return (
    <LinkPageClient
      urlDetails={urlDetails}
      deviceData={deviceData}
      locationData={locationData}
    />
  );
};

export default LinkPage;
