"use client";

import { AuthContext } from "@/app/_components/AuthContext";
import { Login, Signup } from "@/types";
import { ArrowLeft, Loader, Upload, User, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import toast from "react-hot-toast";

const LoginPageClient = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const imageUploadRef = useRef<null | HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { setUser } = useContext(AuthContext);

  const [profilePicPreviewUrl, setProfilePicPreviewUrl] = useState<
    string | null
  >("");

  const [loginFormData, setLoginFormData] = useState<Login>({
    password: "",
    email: "",
  });

  const [signupFormData, setSignupFormData] = useState<Signup>({
    password: "",
    email: "",
    username: "",
    profilePic: "",
  });

  const [loginFormErrors, setLoginFormErrors] = useState<
    Record<string, string>
  >({});

  const [signupFormErrors, setSignupFormErrors] = useState<
    Record<string, string>
  >({});

  const handleLoginDataInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setLoginFormData((p) => ({
      ...p,
      [name]: value,
    }));
    if (loginFormErrors[name])
      setLoginFormErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSignupDataInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSignupFormData((p) => ({
      ...p,
      [name]: value,
    }));
    if (signupFormErrors[name])
      setSignupFormErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleClickChooseFile = () => {
    if (imageUploadRef && imageUploadRef.current)
      imageUploadRef.current.click();
  };

  const handlePreviewProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePicPreviewUrl(url);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        if (!base64Image) return;
        setSignupFormData((p) => ({ ...p, profilePic: base64Image }));
      };
    }
  };

  const validateLoginForm = () => {
    const errors: Record<string, string> = {};
    if (!loginFormData.email) errors.email = "Email is required.";
    if (!loginFormData.password) errors.password = "Password is required.";
    setLoginFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = () => {
    const errors: Record<string, string> = {};
    if (!signupFormData.email) errors.email = "Email is required.";
    if (!signupFormData.password) errors.password = "Password is required.";
    if (!signupFormData.username) errors.username = "Username is required.";
    if (!profilePicPreviewUrl)
      errors.profilePicPreviewUrl = "Profile pic is required.";
    setSignupFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    setIsSubmitting(true);
    const res = await fetch("https://minilink-ohcz.vercel.app/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(loginFormData),
    });
    if (res.ok) {
      const userRes = await fetch("https://minilink-ohcz.vercel.app/api/me");
      const user = await userRes.json();
      setUser(user);
      router.push("/dashboard");
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
    setIsSubmitting(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignupForm()) return;
    setIsSubmitting(true);
    const res = await fetch("https://minilink-ohcz.vercel.app/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(signupFormData),
    });
    if (res.ok) {
      const userRes = await fetch("https://minilink-ohcz.vercel.app/api/me");
      const user = await userRes.json();
      setUser(user);
      router.push("/dashboard");
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 flex justify-center items-center">
      <div className="w-full max-w-md">
        <button
          className="flex-1 px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white mb-8 flex items-center space-x-3"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to home</span>
        </button>
        <h1 className="text-white font-bold text-3xl sm:text-5xl mb-6 text-center">
          Login/Signup
        </h1>
        <div className="border-2 border-white">
          <div className="flex">
            <button
              className={`${
                activeTab === "SIGNUP"
                  ? "px-6 py-4 bg-white text-black  border border-black "
                  : "px-6 py-4 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white"
              } flex-1`}
              onClick={() => setActiveTab("SIGNUP")}
            >
              <span className="text-sm">Signup</span>
            </button>
            <button
              className={`${
                activeTab === "LOGIN"
                  ? "px-6 py-4 bg-white text-black border border-black"
                  : "px-6 py-4 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white"
              } flex-1`}
              onClick={() => setActiveTab("LOGIN")}
            >
              <span className="text-sm">Login</span>
            </button>
          </div>
          <div className="p-8">
            {activeTab === "LOGIN" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 text-white font-medium text-sm block"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="bg-black text-white placeholder-white focus:outline-none border border-white px-4 py-3 w-full"
                    placeholder="Enter your email"
                    required
                    name="email"
                    value={loginFormData.email}
                    onChange={handleLoginDataInputChange}
                  />
                  {loginFormErrors.email && (
                    <p className="text-red-500 mt-1 text-sm">
                      {loginFormErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 text-white font-medium text-sm block"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="bg-black text-white placeholder-white focus:outline-none border border-white px-4 py-3 w-full"
                    placeholder="Enter your password"
                    required
                    name="password"
                    value={loginFormData.password}
                    onChange={handleLoginDataInputChange}
                  />
                  {loginFormErrors.password && (
                    <p className="text-red-500 mt-1 text-sm">
                      {loginFormErrors.password}
                    </p>
                  )}
                </div>
                <button
                  className="flex-1 px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white flex justify-center items-center space-x-3 w-full"
                  onClick={handleLogin}
                >
                  {isSubmitting ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            )}

            {activeTab === "SIGNUP" && (
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 text-white font-medium text-sm block"
                  >
                    Name
                  </label>
                  <input
                    type="username"
                    className="bg-black text-white placeholder-white focus:outline-none border border-white px-4 py-3 w-full"
                    placeholder="Bharath Seshadri"
                    required
                    name="username"
                    value={signupFormData.username}
                    onChange={handleSignupDataInputChange}
                    id="username"
                  />
                  {signupFormErrors.username && (
                    <p className="text-red-500 mt-1 text-sm">
                      {signupFormErrors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="signup-email"
                    className="mb-2 text-white font-medium text-sm block"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="bg-black text-white placeholder-white focus:outline-none border border-white px-4 py-3 w-full"
                    placeholder="Enter your email"
                    required
                    name="email"
                    value={signupFormData.email}
                    onChange={handleSignupDataInputChange}
                    id="signup-email"
                  />
                  {signupFormErrors.email && (
                    <p className="text-red-500 mt-1 text-sm">
                      {signupFormErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="signup-password"
                    className="mb-2 text-white font-medium text-sm block"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="bg-black text-white placeholder-white focus:outline-none border border-white px-4 py-3 w-full"
                    placeholder="Enter your password"
                    required
                    name="password"
                    value={signupFormData.password}
                    onChange={handleSignupDataInputChange}
                    id="signup-password"
                  />
                  {signupFormErrors.password && (
                    <p className="text-red-500 mt-1 text-sm">
                      {signupFormErrors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="profile-pic"
                    className="mb-2 text-white font-medium text-sm block"
                  >
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label
                        htmlFor="profile-pic"
                        className="bg-black text-white hover:bg-white hover:text-black border border-white px-4 py-3 w-full flex justify-center items-center cursor-pointer"
                        onClick={handleClickChooseFile}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        <span>Choose File</span>
                      </label>
                      <input
                        type="file"
                        className="hidden"
                        required
                        onChange={handlePreviewProfilePic}
                        ref={imageUploadRef}
                      />
                    </div>
                    {profilePicPreviewUrl && (
                      <div className="border-2 border-white flex justify-center items-center h-16 w-16">
                        <img
                          className="object-cover overflow-hidden h-full w-full"
                          src={profilePicPreviewUrl}
                          alt="Profile Pic"
                        />
                      </div>
                    )}
                    {!profilePicPreviewUrl && (
                      <div className="border-2 border-white flex justify-center items-center h-16 w-16">
                        <User2Icon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  {signupFormErrors.profilePicPreviewUrl && (
                    <p className="text-red-500 mt-1 text-sm">
                      {signupFormErrors.profilePicPreviewUrl}
                    </p>
                  )}
                </div>
                <button
                  className="flex-1 px-4 py-2 bg-black hover:bg-white transition-colors duration-300 text-white hover:text-black border border-white flex justify-center items-center space-x-3 w-full"
                  onClick={handleSignup}
                >
                  {isSubmitting ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    "Signup"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageClient;
