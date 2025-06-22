"use client";

import { Url } from "@/types";
import { Loader, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import QRCode from "qrcode";
import { createUrl } from "@/actions/url.action";
import { AuthContext } from "@/app/_components/AuthContext";

interface CreateLinkModalProps {
  onClose: () => void;
}

const CreateLinkModal = ({ onClose }: CreateLinkModalProps) => {
  const [formData, setFormData] = useState<Url>({
    title: "",
    longUrl: "",
    shortUrl: "",
    qrCode: "",
    userId: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title) errors.title = "Title is required.";
    if (!formData.longUrl) errors.longUrl = "Url is required.";
    if (!formData.qrCode) errors.qrCode = "Qrcode is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateQrCode = async (url: string) => {
    try {
      const qrCodeUrl = await QRCode.toDataURL(url, {
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        width: 200,
        margin: 2,
      });
      return qrCodeUrl;
    } catch (error) {
      toast.error("Unable to generate qr!");
      return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: value,
    }));
    if (formErrors[name]) setFormErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const res = await createUrl({ ...formData, userId: user?.id as string });
      onClose();
      if (res?.success) toast.success(`Added url successfully!`);
      else throw new Error(res?.error as string);
    } catch (error) {
      toast.error(`Failed to add url!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (formData.longUrl) {
      generateQrCode(formData.longUrl).then((url) =>
        setFormData((p) => ({ ...p, qrCode: url }))
      );
    }
  }, [formData.longUrl]);

  return (
    <>
      <div className="h-full bg-black opacity-50 z-40 fixed inset-0" />
      <div className="z-50 fixed inset-0 flex justify-center items-center">
        <div className="max-w-md w-full z-50 animate-scale rounded-lg shadow-xl border border-white">
          <div className="flex justify-between items-center p-4 border-b border-white">
            <h2 className="text-xl font-semibold">Add Link</h2>
            <button onClick={onClose} className="btn-light">
              <X size={20} />
            </button>
          </div>
          <form className="p-4 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="mb-2 text-white font-medium text-sm block"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="bg-black text-white placeholder-white focus:outline-none border border-white px-4 py-3 w-full"
                placeholder="Enter your Title"
                required
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              {formErrors.title && (
                <p className="text-red-500 mt-1 text-sm">{formErrors.title}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="longUrl"
                className="mb-2 text-white font-medium text-sm block"
              >
                Long Url
              </label>
              <input
                type="url"
                className="bg-black text-white placeholder-white focus:outline-none border border-white px-4 py-3 w-full"
                placeholder="Enter URL"
                required
                name="longUrl"
                value={formData.longUrl}
                onChange={handleInputChange}
              />
              {formErrors.longUrl && (
                <p className="text-red-500 mt-1 text-sm">
                  {formErrors.longUrl}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="shortUrl"
                className="mb-2 text-white font-medium text-sm block"
              >
                Custom Url (optional)
              </label>
              <div className="flex gap-2">
                <div className="bg-black text-white placeholder-white focus:outline-none border border-white px-4 py-3 w-full">
                  localhost:3000
                </div>
                <div className="flex items-center">/</div>
                <input
                  type="shortUrl"
                  className="bg-black text-white placeholder-white focus:outline-none border border-white px-4 py-3 w-full"
                  placeholder="Custom short URL"
                  name="shortUrl"
                  value={formData.shortUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {formData.qrCode && (
              <div>
                <label className="mb-2 text-white font-medium text-sm block">
                  QrCode Preview
                </label>
                <div className="border border-white p-4 inline-block">
                  <img
                    src={formData.qrCode}
                    alt="Qr Code"
                    className="h-32 w-32"
                  />
                </div>
              </div>
            )}
            <button
              className="flex-1 px-4 py-2 bg-white hover:bg-black transition-colors duration-300 text-black hover:text-white border border-black hover:border-white flex justify-center items-center space-x-3 w-full"
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                "Create"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateLinkModal;
