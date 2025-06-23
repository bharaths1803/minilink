export const dynamic = "force-dynamic";

import {
  getDeviceDetails,
  getLocationDetails,
  getUrlDetails,
} from "@/actions/url.action";
import LinkPageClient from "../_components/LinkPageClient";

interface LinkPageProps {
  params: Promise<{
    linkId: string;
  }>;
}

const LinkPage = async ({ params }: LinkPageProps) => {
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
