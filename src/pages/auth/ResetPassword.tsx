import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import fullLogo from "../../assets/app-logo/full-logo.svg";
import lockIcon from "../../assets/lock.svg";
import AuthLayout from "../../components/auth/AuthLayout";
import axiosInstance from "../../lib/axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const state = location.state as { email?: string };
    if (state?.email) {
      setEmail(state.email);
    } else {
      // If no email provided, redirect to forgot password
      navigate("/accounts/password/reset/");
    }
  }, [location, navigate]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUppercase && hasNumber && hasSpecialChar;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    setOtpError(false);
    setIsShaking(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-focus next input but don't auto-submit
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setError("");
      setOtpError(false);
      setIsShaking(false);
      inputRefs.current[5]?.focus();

      // Just fill the inputs, don't auto-submit
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.join("").length !== 6) {
      setOtpError(true);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setOtpError(false);
      }, 600);
      return;
    }

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
      await axiosInstance.post("/api/v1/auth/reset-password", {
        email_address: email,
        otp_code: otp.join(""),
        new_password: newPassword,
      });
      // Success - show success state
      setIsSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while resetting password";

      // Check if error is OTP-related
      if (
        errorMessage.toLowerCase().includes("otp") ||
        errorMessage.toLowerCase().includes("verification code") ||
        errorMessage.toLowerCase().includes("invalid") ||
        errorMessage.toLowerCase().includes("expired") ||
        errorMessage.toLowerCase().includes("code")
      ) {
        // For OTP errors, just show vibration
        setOtpError(true);
        setIsShaking(true);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setTimeout(() => {
          setIsShaking(false);
          setOtpError(false);
        }, 600);
      } else {
        // For other errors, show text
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    setOtpError(false);
    setIsShaking(false);

    try {
      await axiosInstance.post("/api/v1/auth/resend-otp", {
        email_address: email,
      });
      // Show success message or handle success
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const isFormValid =
    otp.every((digit) => digit !== "") &&
    newPassword &&
    confirmPassword &&
    validatePassword(newPassword) &&
    newPassword === confirmPassword;

  const handleGoToLogin = () => {
    navigate("/");
  };

  // Success State
  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="text-center w-full max-w-3xl">
          <div className="flex justify-center mb-6">
            <img src={lockIcon} alt="Success" className="h-[132px] w-[132px]" />
          </div>

          <h2 className="text-[26px] font-semibold leading-[120%] tracking-[-0.02em] text-[#1E1E1E] font-inter mb-4">
            Password Reset Successfully!
          </h2>

          <p className="text-base font-normal leading-[144%] tracking-[-0.04em] text-[#2E2E2E] font-inter mb-8">
            You can now log in with your new password.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleGoToLogin}
              className="w-full max-w-[512px] h-12 px-6 py-3 rounded-lg font-medium text-base leading-[150%] tracking-[-0.05em] text-white font-inter transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer"
              style={{
                background:
                  "linear-gradient(270deg, #7000CC 0%, #8000E6 50%, #8E07F8 100%)",
                backdropFilter: "blur(200px)",
              }}
            >
              Go to Login
            </button>
          </div>
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
          Reset your password
        </h2>
        <p className="text-[16px] font-normal leading-[144%] tracking-[-4%] text-[#2E2E2E] font-inter">
          We've sent a verification code to{" "}
          <span className="font-semibold">{email}</span>. Enter the code and
          your new password below.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email (read-only) */}
        <div className="mb-[24px]">
          <label
            htmlFor="email"
            className="block text-[15px] font-medium leading-[130%] tracking-[-2%] text-[#2E2E2E] font-inter mb-2"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-xl bg-gray-50 text-[15px] font-normal leading-[130%] tracking-[-4%] text-gray-600 font-inter cursor-not-allowed"
          />
        </div>

        {/* OTP Code */}
        <div className="mb-6">
          <label className="block text-[15px] font-medium leading-[130%] tracking-[-2%] text-[#2E2E2E] font-inter mb-4">
            Verification Code *
          </label>
          <div
            className={`flex justify-center space-x-2 sm:space-x-3 mb-4 ${
              isShaking ? "animate-shake" : ""
            }`}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-[16px] sm:text-[20px] font-semibold border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  isShaking || otpError
                    ? "border-red-500 bg-red-50"
                    : "border-[#D5D7DA]"
                }`}
                maxLength={1}
                disabled={isLoading}
              />
            ))}
          </div>
          <div className="flex">
            <p className="text-[14px] font-normal leading-5 tracking-[-0.5px] text-center text-[#6E7191] font-inter">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-[14px] font-medium leading-5 tracking-[-0.5px] text-center underline decoration-solid text-purple-600 hover:text-purple-700 font-inter transition-colors cursor-pointer disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            </p>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-[24px]">
          <label
            htmlFor="newPassword"
            className="block text-[15px] font-medium leading-[130%] tracking-[-2%] text-[#2E2E2E] font-inter mb-2"
          >
            New Password *
          </label>
          <div className="w-full h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-colors flex items-center justify-between">
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

        {/* Confirm Password */}
        <div className="mb-[16px]">
          <label
            htmlFor="confirmPassword"
            className="block text-[15px] font-medium leading-[130%] tracking-[-2%] text-[#2E2E2E] font-inter mb-2"
          >
            Confirm new password *
          </label>
          <div className="w-full h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-colors flex items-center justify-between">
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
        </div>

        {/* Password Requirements */}
        <div className="w-full mb-6">
          <p className="text-[14px] font-normal leading-5 tracking-[-0.5px] text-[#717680] font-inter">
            Password must be at least 8 characters, include uppercase, number,
            and special character.
          </p>
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full max-w-[512px] h-12 px-6 py-3 rounded-lg font-medium text-base leading-[150%] tracking-[-0.05em] text-white font-inter transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            style={{
              background:
                isLoading || !isFormValid
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
              "Reset Password"
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
