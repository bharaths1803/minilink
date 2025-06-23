"use client";

import {
  LayoutDashboard,
  LinkIcon,
  Loader,
  LogOutIcon,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loggingout, setLoggingout] = useState<boolean>(false);
  const router = useRouter();
  const handleLogout = async () => {
    setLoggingout(true);
    const res = await fetch("/api/logout", {
      method: "POST",
    });
    if (res.ok) {
      setUser(null);
      router.push("/login");
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
    setLoggingout(false);
  };
  return (
    <header className="sticky top-0 bg-black border-b-2 border-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex justify-between">
          <div className="flex items-center space-x-2">
            <LinkIcon className="text-white h-8 w-8" />
            <span className="text-white text-xl font-bold">MiniLink</span>
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="btn-light my-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
              <div className="relative">
                <button
                  className="my-2 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={user.profilePicUrl}
                    alt="Profile Pic"
                    className="w-10 h-10 rounded-full"
                  />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-white shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-white">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-300">{user.email}</p>
                      </div>
                      <button
                        className="px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black flex items-center space-x-2 mt-2.5 w-full"
                        onClick={handleLogout}
                      >
                        {!loggingout && (
                          <>
                            <LogOutIcon className="h-4 w-4" />
                            <span className="text-sm">Logout</span>
                          </>
                        )}
                        {loggingout && (
                          <>
                            <Loader
                              size={18}
                              className="animate-spin text-center"
                            />
                            <span className="text-sm">Logging out</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link href="/login" className="btn-light my-2.5">
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
