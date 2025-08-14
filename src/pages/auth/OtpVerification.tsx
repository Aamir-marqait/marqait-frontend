import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { authService } from "../../api";
import { useAuthStore } from "../../stores/authStore";
import fullLogo from "../../assets/app-logo/full-logo.svg";
import AuthLayout from "../../components/auth/AuthLayout";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { initialize } = useAuthStore();

  const email = location.state?.email || "";
  const message = location.state?.message || "";

  useEffect(() => {
    if (!email) {
      navigate("/accounts/emailsignup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    setIsShaking(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setError("");
      setIsShaking(false);
      inputRefs.current[5]?.focus();
      
      setTimeout(() => {
        handleSubmit(pastedData);
      }, 100);
    }
  };

  const handleSubmit = async (otpValue: string = otp.join("")) => {
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");
    setIsShaking(false);

    try {
      const response = await authService.verifyOtp({
        email_address: email,
        otp_code: otpValue,
      });

      // Initialize auth store with the user data
      await initialize();
      
      navigate("/dashboard", {
        state: {
          message: `Welcome ${response.user.first_name}! Your account has been verified successfully.`,
        },
      });
    } catch (error: any) {
      setError(error.message || "Invalid verification code. Please try again.");
      setIsShaking(true);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setIsShaking(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(30);
    setError("");
    setIsShaking(false);
    
    try {
      // For now, we'll assume resend functionality might be available later
      // You can implement this once the API endpoint is available
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("OTP resent to:", email);
      // TODO: Call actual resend OTP API when available
    } catch (error: any) {
      setError(error.message || "Failed to resend OTP. Please try again.");
      setResendCooldown(0);
    }
  };

  const handleGoBack = () => {
    navigate("/accounts/emailsignup");
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 mb-6 text-[#717680] hover:text-[#2E2E2E] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-[14px] font-medium leading-4 tracking-[-0.02em] font-inter">
            Back to signup
          </span>
        </button>

        <div className="mb-4">
          <img src={fullLogo} alt="MARQAIT" className="h-6" />
        </div>
        <h2 className="text-[26px] font-semibold leading-[120%] tracking-[-0.02em] text-[#1E1E1E] font-inter mb-[8px]">
          Verify your email
        </h2>
        <p className="text-base font-normal leading-[144%] tracking-[-0.04em] text-[#2E2E2E] font-inter">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-[#1E1E1E]">{email}</span>
        </p>
        {message && (
          <p className="text-sm text-green-600 mt-2 font-medium">
            {message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-[15px] font-medium leading-[130%] tracking-[-0.02em] text-[#2E2E2E] font-inter mb-4">
          Verification Code
        </label>
        <div className={`flex justify-center space-x-2 sm:space-x-3 mb-4 ${isShaking ? 'animate-shake' : ''}`}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-[16px] sm:text-[20px] font-semibold border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                isShaking || error ? 'border-red-500 bg-red-50' : 'border-[#D5D7DA]'
              }`}
              maxLength={1}
              disabled={isLoading}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center space-x-2 mb-4 text-red-600">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || otp.some(digit => digit === "")}
          className="w-full max-w-[512px] h-12 px-6 py-3 rounded-lg font-medium text-base leading-[150%] tracking-[-0.05em] text-white font-inter transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
          style={{
            background: isLoading || otp.some(digit => digit === "")
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
            "Verify Code"
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-[14px] font-normal leading-5 tracking-[-0.5px] text-[#717680] font-inter">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={resendCooldown > 0}
            className="text-[14px] font-medium leading-5 tracking-[-0.5px] text-purple-600 hover:text-purple-700 font-inter transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default OtpVerification;