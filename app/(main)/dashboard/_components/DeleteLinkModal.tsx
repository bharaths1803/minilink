"use client";

import { deleteUrl } from "@/actions/url.action";
import { Loader, Trash, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteLinkModalProps {
  onClose: () => void;
  urlId: string;
  title: string;
}

const DeleteLinkModal = ({ onClose, urlId, title }: DeleteLinkModalProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteUrl(urlId);
      onClose();
      if (res?.success) toast.success("Deleted link successfully!");
      else throw new Error(res?.error as string);
    } catch (error) {
      toast.error("Failed to delete link!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="h-full bg-black opacity-50 z-40 fixed inset-0" />
      <div className="z-50 fixed inset-0 flex justify-center items-center">
        <div className="max-w-md w-full z-50 animate-scale rounded-lg shadow-xl border border-white p-6 space-y-4">
          <div className="border-b border-white">
            <h2 className="text-xl font-semibold">Delete Link</h2>
          </div>
          <p className="text-white">
            Are you sure you want to delete this url "{title}" ?
          </p>
          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white mb-8 flex justify-center items-center space-x-3"
              onClick={onClose}
            >
              <X size={16} />
              <span className="text-sm">Cancel</span>
            </button>
            <button
              className="flex-1 px-4 py-2 bg-black hover:bg-red-500 transition-colors duration-300 text-white border border-white mb-8 flex justify-center items-center space-x-3"
              onClick={handleDelete}
            >
              {!isDeleting ? (
                <Trash size={16} />
              ) : (
                <Loader size={16} className="animate-spin" />
              )}
              <span className="text-sm">
                {isDeleting ? "Deleting" : "Delete"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteLinkModal;
