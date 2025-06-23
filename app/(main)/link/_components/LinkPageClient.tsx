"use client";

import {
  getDeviceDetails,
  getLocationDetails,
  getUrlDetails,
} from "@/actions/url.action";
import {
  Calendar,
  Check,
  CopyIcon,
  Download,
  LinkIcon,
  PieChartIcon,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import DeleteLinkModal from "../../dashboard/_components/DeleteLinkModal";
import { COLORS } from "@/data";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";
import Link from "next/link";

type UrlDetails = Awaited<ReturnType<typeof getUrlDetails>>;
type DeviceData = Awaited<ReturnType<typeof getDeviceDetails>>;
type LocationData = Awaited<ReturnType<typeof getLocationDetails>>;

interface LinkPageClientProps {
  urlDetails: UrlDetails;
  deviceData: DeviceData;
  locationData: LocationData;
}

const LinkPageClient = ({
  urlDetails,
  deviceData,
  locationData,
}: LinkPageClientProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copyUrlId, setCopyUrlId] = useState<string>("");

  const router = useRouter();

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleOpenDeleteOpen = (urlId: string, title: string) => {
    setShowDeleteModal(true);
  };

  const handleCopy = async (url: string, copyUrlId: string) => {
    try {
      await navigator.clipboard.writeText(
        `https://minilink-pi.vercel.app/${url}`
      );
      setCopyUrlId(copyUrlId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy!");
    }
  };

  const handleDowload = (qrCode: string, title: string) => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.setAttribute("download", `${title}.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white">
            {urlDetails?.title}
          </h1>
          <Link
            className="text-lg md:text-xl text-white font-semibold block"
            href={`/${urlDetails?.shortUrl}`}
          >
            https://minilink-pi.vercel.app/{urlDetails?.shortUrl}
          </Link>
          <div className="flex items-start max-w-md break-all space-x-2">
            <LinkIcon size={18} className="mt-1" />
            <a
              className="text-sm text-white break-all"
              href={`${urlDetails?.longUrl}`}
              target="_blank"
            >
              {urlDetails?.longUrl}
            </a>
          </div>
          <div className="flex items-center text-gray-400">
            <Calendar size={18} className="mr-1" />
            <span className="text-sm">
              {new Date(urlDetails?.createdAt || "").toLocaleDateString()}{" "}
              {new Date(urlDetails?.createdAt || "").toLocaleTimeString()}
            </span>
          </div>
          <div className="inline-flex space-x-3">
            <button
              className="flex-1 px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white mb-8 flex items-center space-x-3"
              onClick={() =>
                handleDowload(urlDetails?.qrCode || "", urlDetails?.title || "")
              }
            >
              <Download size={16} />
              <span className="text-sm">Download</span>
            </button>
            <button
              className="flex-1 px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white mb-8 flex items-center space-x-3"
              onClick={() =>
                handleCopy(
                  urlDetails?.shortUrl as string,
                  urlDetails?.id as string
                )
              }
            >
              {copied ? <Check size={16} /> : <CopyIcon size={16} />}
              <span className="text-sm">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              className="flex-1 px-4 py-2 bg-black hover:bg-red-500 transition-colors duration-300 text-white border border-white mb-8 flex items-center space-x-3"
              onClick={() =>
                handleOpenDeleteOpen(
                  urlDetails?.id || "",
                  urlDetails?.title || ""
                )
              }
            >
              <Trash size={16} />
              <span className="text-sm">Delete</span>
            </button>
          </div>
          <img src={urlDetails?.qrCode} alt="Qr Code" className={`h-96 w-96`} />
        </div>

        <div className="space-y-4 border-2 border-white flex-1">
          {deviceData && deviceData.length > 0 ? (
            <div className="p-6">
              <h2 className="text-xl mb-6">Device Type</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`
                      }
                    >
                      {deviceData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-full flex justify-center items-center text-white">
              <h3 className="text-xl sm:text-3xl lg:text-5xl">No Stats</h3>
            </div>
          )}

          {locationData && locationData.length > 0 && (
            <div className="p-6">
              <h2 className="text-xl mb-6">Device Location</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart width={500} height={300} data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteLinkModal
          urlId={urlDetails?.id as string}
          onClose={handleCloseDeleteModal}
          title={urlDetails?.title as string}
        />
      )}
    </div>
  );
};

export default LinkPageClient;
