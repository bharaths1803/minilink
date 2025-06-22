"use client";
import {
  BarChart3,
  Calendar,
  Check,
  CopyIcon,
  Download,
  ExternalLink,
  LinkIcon,
  PlusIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";
import CreateLinkModal from "./CreateLinkModal";
import { getDashboardData } from "@/actions/dashboard.action";
import router from "next/navigation";
import DeleteLinkModal from "./DeleteLinkModal";
import Link from "next/link";
import toast from "react-hot-toast";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

interface DashboardPageClientProps {
  dashboardData: DashboardData;
}

const DashboardPageClient = ({ dashboardData }: DashboardPageClientProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [deletingLink, setDeletingLink] = useState<{
    urlId: string;
    title: string;
  }>({
    urlId: "",
    title: "",
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleOpenDeleteOpen = (urlId: string, title: string) => {
    setDeletingLink({
      urlId,
      title,
    });
    setShowDeleteModal(true);
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
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
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="font-bold text-white text-xl sm:text-2xl lg:text-4xl">
          My Dashboard
        </h1>
        <button
          className="btn-light my-2.5 cursor-pointer"
          onClick={() => setShowModal(!showModal)}
        >
          <PlusIcon size={18} />
          <span className="text-sm">Create Link</span>
        </button>
      </div>

      {/* Dashboard Card */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border-2 border-white text-white p-4 flex items-center justify-between">
          <div>
            <p className="text-white text-lg">Total Links</p>
            <span className="text-3xl font-bold mt-1">
              {dashboardData.linksCnt}
            </span>
          </div>
          <LinkIcon size={24} />
        </div>
        <div className="border-2 border-white text-white p-4 flex items-center justify-between">
          <div>
            <p className="text-white text-lg">Total Clicks</p>
            <span className="text-3xl font-bold mt-1">
              {dashboardData.clicksCnt}
            </span>
          </div>
          <BarChart3 size={24} />
        </div>
      </div>

      {dashboardData.links.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData.links.map((link) => (
            <div
              className="border-2 border-white text-white p-4 space-y-4"
              key={link.id}
            >
              <img src={link.qrCode} alt="Qr Code" className="h-28 w-28" />
              <h3 className="font-bold text-lg">{link.title}</h3>
              <div>
                <p className="text-gray-300">Short URL</p>
                <div className="flex gap-2 items-center mt-1">
                  <div className="border border-white px-2 flex-1 h-8 text-xs flex items-center">
                    localhost:3000/{link.customUrl || link.shortUrl}
                  </div>
                  <button
                    className="w-10 h-10 border bg-black hover:bg-white border-white hover:border-black flex justify-center items-center text-white hover:text-black transition-colors duration-300"
                    onClick={() =>
                      handleCopy(
                        (link.shortUrl as string) || (link.customUrl as string)
                      )
                    }
                  >
                    {copied ? <Check size={18} /> : <CopyIcon size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-gray-300">Long URL</p>
                <div className="border border-white px-2 flex-1 h-8 text-xs flex items-center">
                  {link.longUrl}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center">
                  <BarChart3 size={18} className="mr-1" />
                  <span className="text-sm">{link.clicks.length} clicks</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-1" />
                  <span className="text-sm">
                    {new Date(link.createdAt).toLocaleDateString()}{" "}
                    {new Date(link.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="inline-flex space-x-3">
                <Link
                  className="flex-1 px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white mb-8 flex items-center space-x-3"
                  href={`/link/${link.shortUrl}`}
                >
                  <ExternalLink size={16} />
                  <span className="text-sm">Visit</span>
                </Link>
                <button
                  className="flex-1 px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white mb-8 flex items-center space-x-3"
                  onClick={() => handleDowload(link.qrCode, link.title)}
                >
                  <Download size={16} />
                  <span className="text-sm">Download</span>
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white mb-8 flex items-center space-x-3"
                  onClick={() =>
                    handleCopy(
                      (link.shortUrl as string) || (link.customUrl as string)
                    )
                  }
                >
                  {copied ? <Check size={16} /> : <CopyIcon size={16} />}
                  <span className="text-sm">{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-black hover:bg-red-500 transition-colors duration-300 text-white border border-white mb-8 flex items-center space-x-3"
                  onClick={() => handleOpenDeleteOpen(link.id, link.title)}
                >
                  <Trash size={16} />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-white text-white px-4 py-8 text-center space-y-4">
          <LinkIcon size={48} className="mx-auto" />
          <h2 className="font-bold text-2xl">No links created yet</h2>
          <p className="text-lg">
            Create your first shortened link to get started.
          </p>
          <button
            className="btn-light mx-auto cursor-pointer"
            onClick={() => setShowModal(!showModal)}
          >
            <PlusIcon size={18} />
            <span className="text-sm">Create Your First Link</span>
          </button>
        </div>
      )}

      {showModal && <CreateLinkModal onClose={handleCloseModal} />}

      {showDeleteModal && (
        <DeleteLinkModal
          onClose={handleCloseDeleteModal}
          urlId={deletingLink.urlId}
          title={deletingLink.title}
        />
      )}
    </div>
  );
};

export default DashboardPageClient;
