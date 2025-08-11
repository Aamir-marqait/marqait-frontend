import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import fullLogo from "../../assets/app-logo/full-logo.svg";
import AuthLayout from "../../components/auth/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch {
      // Handle error silently for now
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout>
            <div className="mb-11">
              <div className="mb-8">
                <div className="mb-[24px]">
                  <img src={fullLogo} alt="MARQAIT" className="h-6" />
                </div>

                <h2 className="text-[26px] font-semibold leading-[120%] tracking-[-2%] text-[#1E1E1E] font-inter mb-2">
                  Verify Your Email Address
                </h2>
              </div>
            </div>

            <div className="w-[640px] text-left mb-8">
              <p className="text-[20px] font-normal leading-[156%] tracking-[-4%] text-[#2E2E2E] font-inter">
                We've sent a verification link to{" "}
                <span className="font-semibold whitespace-nowrap">{email}</span>
              </p>
              <p className="text-[20px] font-normal leading-[156%] tracking-[-4%] text-[#2E2E2E] font-inter">
                Please check your inbox and click the link to proceed.
              </p>
            </div>

            <div className="w-[640px] flex justify-center">
              <button
                onClick={() => {}}
                className="w-[512px] cursor-pointer h-12 px-6 py-3 rounded-lg font-medium text-base leading-[150%] tracking-[-5%] text-white font-inter transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                style={{
                  background:
                    "linear-gradient(270deg, #7000CC 0%, #8000E6 50%, #8E07F8 100%)",
                  backdropFilter: "blur(200px)",

                  borderImage:
                    "linear-gradient(270deg, #7000CC 0%, #8000E6 50%, #8E07F8 100%) 1",
                }}
              >
                Resend Verification Email
              </button>
            </div>

            <div className="w-[640px] flex justify-center mt-4">
              <p className="text-[14px] font-normal leading-5 tracking-[-0.5px] text-center text-[#6E7191] font-inter">
                Didn't receive the email? Check your spam folder.
              </p>
            </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
          <div className="mb-8">
            <div className="mb-[24px]">
              <img src={fullLogo} alt="MARQAIT" className="h-6" />
            </div>

            <h2 className="text-[26px] font-semibold leading-[120%] tracking-[-2%] text-[#1E1E1E] font-inter mb-2">
              Forgot your password?
            </h2>
            <p className="text-[16px] font-normal leading-[144%] tracking-[-4%] text-[#2E2E2E] font-inter">
              Enter your email address and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-[24px]">
              <label
                htmlFor="email"
                className="block text-[15px] font-medium leading-[130%] tracking-[-2%] text-[#2E2E2E] font-inter mb-2"
              >
                Email address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[640px] h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-[15px] font-normal leading-[130%] tracking-[-4%] text-black font-inter placeholder-[#717680]"
                placeholder="Enter your registered email"
                required
              />
            </div>

            <div className="w-[640px] flex justify-center mb-6">
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-[512px] h-12 px-6 py-3 rounded-lg font-medium text-base leading-[150%] tracking-[-0.05em] text-white font-inter transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                style={{
                  background:
                    isLoading || !email
                      ? "linear-gradient(270deg, rgba(112, 0, 204, 0.32) 0%, rgba(128, 0, 230, 0.32) 50%, rgba(142, 7, 248, 0.32) 100%)"
                      : "linear-gradient(270deg, #7000CC 0%, #8000E6 50%, #8E07F8 100%)",
                  backdropFilter: "blur(200px)",
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

          {/* Sign Up Link */}
          <div className="w-[640px] mx-auto flex justify-center">
            <p className="text-[14px] font-normal leading-5 tracking-[-0.5px] text-center align-middle text-gray-600 font-inter">
              Remembered your password?
              <Link
                to="/"
                className="text-[14px] font-medium leading-5 tracking-[-0.5px] text-center align-middle underline decoration-solid text-purple-600 hover:text-purple-700 font-inter transition-colors cursor-pointer"
              >
                {" "}
                Login here
              </Link>
            </p>
          </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
