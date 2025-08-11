/* eslint-disable react-hooks/exhaustive-deps */
import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import dummy from "../../assets/dummy.jpg";
import fullLogo from "../../assets/app-logo/full-logo.svg";
import lockIcon from "../../assets/lock.svg";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      title: "Marketers Scaling\nFaster with Marqait",
      subtitle: "Join thousands automating campaigns smarter.",
    },
    {
      title: "Advanced\nAnalytics Insights",
      subtitle: "Make data-driven decisions with powerful analytics.",
    },
    {
      title: "Seamless\nCampaign Management",
      subtitle: "Streamline your marketing workflows effortlessly.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUppercase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch {
      setError("An error occurred while resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    newPassword &&
    confirmPassword &&
    validatePassword(newPassword) &&
    newPassword === confirmPassword;

  if (isSuccess) {
    return (
      <div className="min-h-screen flex">
        <div
          className="hidden lg:flex lg:w-2/5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${dummy})`,
            }}
          ></div>

          <div className="relative z-20 flex flex-col justify-end p-12 text-white">
            <div className="mb-8">
              <h1 className="text-[40px] font-medium leading-[120%] tracking-[-0.05em] mb-4 font-inter whitespace-pre-line">
                {carouselSlides[currentSlide].title}
              </h1>
              <p className="text-base font-normal leading-[154%] tracking-[-0.04em] font-inter text-[#FAFAFA]">
                {carouselSlides[currentSlide].subtitle}
              </p>
            </div>

            <div className="flex space-x-2 justify-start">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide ? "w-8 bg-white" : "w-6 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/5 flex items-center justify-center pl-20 pr-8 py-8 bg-white">
          <div className="w-full max-w-lg text-center">
            <div className="mb-11">
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <img src={lockIcon} alt="Lock" className="w-36 h-36" />
                </div>

                <h2 className="text-[26px] font-semibold leading-[120%] tracking-[-2%] text-[#1E1E1E] font-inter mb-2">
                  Password Reset Successfully!
                </h2>
                <p className="text-[16px] font-normal leading-[144%] tracking-[-4%] text-[#2E2E2E] font-inter">
                  You can now log in with your new password.
                </p>
              </div>
            </div>

            <div className="w-[640px] flex mx-auto">
              <Link
                to="/"
                className="w-[512px] h-12 px-6 py-3 rounded-lg font-medium text-base leading-[150%] tracking-[-0.05em] text-white font-inter transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer flex items-center justify-center no-underline"
                style={{
                  background:
                    "linear-gradient(270deg, #7000CC 0%, #8000E6 50%, #8E07F8 100%)",
                  backdropFilter: "blur(200px)",

                  borderImage:
                    "linear-gradient(270deg, #7000CC 0%, #8000E6 50%, #8E07F8 100%) 1",
                }}
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div
        className="hidden lg:flex lg:w-2/5 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${dummy})`,
          }}
        ></div>

        <div className="relative z-20 flex flex-col justify-end p-12 text-white">
          <div className="mb-8">
            <h1 className="text-[40px] font-medium leading-[120%] tracking-[-0.05em] mb-4 font-inter whitespace-pre-line">
              {carouselSlides[currentSlide].title}
            </h1>
            <p className="text-base font-normal leading-[154%] tracking-[-0.04em] font-inter text-[#FAFAFA]">
              {carouselSlides[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex space-x-2 justify-start">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide ? "w-8 bg-white" : "w-6 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-start pl-20 pr-8 py-8 bg-white">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <div className="mb-[24px]">
              <img src={fullLogo} alt="MARQAIT" className="h-6" />
            </div>

            <h2 className="text-[26px] font-semibold leading-[120%] tracking-[-2%] text-[#1E1E1E] font-inter mb-2">
              Reset your password
            </h2>
            <p className="text-[16px] font-normal leading-[144%] tracking-[-4%] text-[#2E2E2E] font-inter">
              Enter a new password to secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-[24px]">
              <label
                htmlFor="newPassword"
                className="block text-[15px] font-medium leading-[130%] tracking-[-2%] text-[#2E2E2E] font-inter mb-2"
              >
                New Password *
              </label>
              <div className="w-[640px] h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-colors flex items-center justify-between">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 outline-none text-[15px] font-normal leading-6 tracking-[-0.04em] text-black font-inter placeholder-[#717680] bg-transparent"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-2 cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-[16px]">
              <label
                htmlFor="confirmPassword"
                className="block text-[15px] font-medium leading-[130%] tracking-[-2%] text-[#2E2E2E] font-inter mb-2"
              >
                Confirm new password *
              </label>
              <div className="w-[640px] h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-colors flex items-center justify-between">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 outline-none text-[15px] font-normal leading-6 tracking-[-0.04em] text-black font-inter placeholder-[#717680] bg-transparent"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-2 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {error && confirmPassword && (
                <div className="w-[640px] flex items-center space-x-2 mt-2">
                  <AlertCircle className="h-4 w-4 text-[#C20B26] flex-shrink-0" />
                  <span className="text-[14px] font-normal leading-[130%] tracking-[-0.05em] text-[#C20B26] font-inter">
                    {error}
                  </span>
                </div>
              )}
            </div>

            <div className="w-[640px] mb-6">
              <p className="text-[14px] font-normal leading-5 tracking-[-0.5px] text-[#717680] font-inter">
                Password must be at least 8 characters, include uppercase,
                number, and special character.
              </p>
            </div>

            <div className="w-[640px] flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-[512px] h-12 px-6 py-3 rounded-lg font-medium text-base leading-[150%] tracking-[-0.05em] text-white font-inter transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                style={{
                  background:
                    isLoading || !isFormValid
                      ? "linear-gradient(270deg, rgba(112, 0, 204, 0.32) 0%, rgba(128, 0, 230, 0.32) 50%, rgba(142, 7, 248, 0.32) 100%)"
                      : "linear-gradient(270deg, #7000CC 0%, #8000E6 50%, #8E07F8 100%)",
                  backdropFilter: "blur(200px)",
                  borderImage:
                    isLoading || !isFormValid
                      ? "linear-gradient(270deg, rgba(112, 0, 204, 0.32) 0%, rgba(128, 0, 230, 0.32) 50%, rgba(142, 7, 248, 0.32) 100%) 1"
                      : "linear-gradient(270deg, #7000CC 0%, #8000E6 50%, #8E07F8 100%) 1",
                }}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Reset password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
