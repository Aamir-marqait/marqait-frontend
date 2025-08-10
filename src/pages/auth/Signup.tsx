/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import type React from "react";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import dummy from "../../assets/dummy.jpg";
import fullLogo from "../../assets/app-logo/full-logo.svg";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();

  const carouselSlides = [
    {
      title: "Start Automating\nCampaigns Today",
      subtitle: "Join thousands growing their brands with smart automation.",
    },
    {
      title: "Advanced\nMarketing Tools",
      subtitle: "Access powerful features to scale your marketing efforts.",
    },
    {
      title: "Data-Driven\nInsights",
      subtitle: "Make informed decisions with comprehensive analytics.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    if (!companyName.trim()) return "Company name is required";
    if (!domain.trim()) return "Domain/Industry is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate("/", { 
        state: { 
          message: "Account created successfully! Please sign in with your credentials." 
        }
      });
    } catch {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign-up clicked");
  };

  const handlePasswordBlur = () => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match. Please re-enter.");
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match. Please re-enter.");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError("");
    if (confirmPassword && value === confirmPassword) {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordError("");
    if (password && value === password) {
      setPasswordError("");
    }
  };

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

      <div className="w-full lg:w-3/5 flex items-center justify-start pl-20 pr-8 py-8 bg-white">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <div className="mb-4">
              <img src={fullLogo} alt="MARQAIT" className="h-6" />
            </div>
            <h2 className="text-[26px] font-semibold leading-[120%] tracking-[-0.02em] text-[#1E1E1E] font-inter mb-[8px]">
              Create your account
            </h2>
            <p className="text-base font-normal leading-[144%] tracking-[-0.04em] text-[#2E2E2E] font-inter">
              Start automating campaigns and growing your brand in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex space-x-4 w-[640px]">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-[15px] font-medium leading-[130%] tracking-[-0.02em] text-[#2E2E2E] font-inter mb-1"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-[15px] font-normal leading-6 tracking-[-0.04em] text-black font-inter placeholder-[#717680]"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-[15px] font-medium leading-[130%] tracking-[-0.02em] text-[#2E2E2E] font-inter mb-1"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-[15px] font-normal leading-6 tracking-[-0.04em] text-black font-inter placeholder-[#717680]"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-[15px] font-medium leading-[130%] tracking-[-0.02em] text-[#2E2E2E] font-inter mb-2"
              >
                Email address *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[640px] h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-[15px] font-normal leading-6 tracking-[-0.04em] text-black font-inter placeholder-[#717680]"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="mb-4 flex space-x-4 w-[640px]">
              <div className="flex-1">
                <label
                  htmlFor="password"
                  className="block text-[15px] font-medium leading-[130%] tracking-[-0.02em] text-[#2E2E2E] font-inter mb-1"
                >
                  Create Password *
                </label>
                <div className="w-full h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-colors flex items-center justify-between">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={handlePasswordBlur}
                    className="flex-1 outline-none text-[15px] font-normal leading-6 tracking-[-0.04em] text-black font-inter placeholder-[#717680] bg-transparent"
                    placeholder="Create your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-[15px] font-medium leading-[130%] tracking-[-0.02em] text-[#2E2E2E] font-inter mb-1"
                >
                  Confirm Password *
                </label>
                <div className="w-full h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-colors flex items-center justify-between">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    onBlur={handleConfirmPasswordBlur}
                    className="flex-1 outline-none text-[15px] font-normal leading-6 tracking-[-0.04em] text-black font-inter placeholder-[#717680] bg-transparent"
                    placeholder="Confirm your password"
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
            </div>

            {passwordError && (
              <div className="w-[640px] flex justify-end items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-[#C20B26] flex-shrink-0" />
                <span className="text-[14px] font-normal leading-[130%] tracking-[-0.05em] text-[#C20B26] font-inter">
                  {passwordError}
                </span>
              </div>
            )}

            <div className="mb-4 flex space-x-4 w-[640px]">
              <div className="flex-1">
                <label
                  htmlFor="companyName"
                  className="block text-[15px] font-medium leading-[130%] tracking-[-0.02em] text-[#2E2E2E] font-inter mb-1"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-[15px] font-normal leading-6 tracking-[-0.04em] text-black font-inter placeholder-[#717680]"
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="domain"
                  className="block text-[15px] font-medium leading-[130%] tracking-[-0.02em] text-[#2E2E2E] font-inter mb-1"
                >
                  Domain / Industry
                </label>
                <input
                  id="domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full h-12 px-3 py-[11px] border border-[#D5D7DA] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-[15px] font-normal leading-6 tracking-[-0.04em] text-black font-inter placeholder-[#717680]"
                  placeholder="company.com or industry"
                  required
                />
              </div>
            </div>


            <div className="w-[640px] flex justify-between items-center mt-2 mb-3">
              <div className="flex items-center space-x-2">
                {error && (
                  <>
                    <AlertCircle className="h-4 w-4 text-[#C20B26] flex-shrink-0" />
                    <span className="text-[14px] font-normal leading-[130%] tracking-[-0.05em] text-[#C20B26] font-inter">
                      {error}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="cursor-pointer h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded bg-[#D5D7DA]"
              />
              <label
                htmlFor="terms"
                className="text-[14px] font-medium leading-4 tracking-[-0.5px] font-inter text-[#717680]"
              >
                I agree to all{" "}
                <Link
                  to="/terms"
                  className="text-[14px] font-semibold leading-4 tracking-[-0.5px] font-inter text-[#717680] hover:text-purple-700 transition-colors cursor-pointer"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-[14px] font-semibold leading-4 tracking-[-0.5px] font-inter text-[#717680] hover:text-purple-700 transition-colors cursor-pointer"
                >
                  Privacy policy
                </Link>
              </label>
            </div>

            <div className="w-[640px] flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !agreeToTerms || !firstName || !lastName || !email || !password || !confirmPassword || !companyName || !domain}
                className="w-[512px] h-12 px-6 py-3 rounded-lg font-medium text-base leading-[150%] tracking-[-0.05em] text-white font-inter transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                style={{
                  background:
                    isLoading || !agreeToTerms || !firstName || !lastName || !email || !password || !confirmPassword || !companyName || !domain
                      ? "linear-gradient(270deg, rgba(112, 0, 204, 0.32) 0%, rgba(128, 0, 230, 0.32) 50%, rgba(142, 7, 248, 0.32) 100%)"
                      : "linear-gradient(270deg, #7000CC 0%, #8000E6 50%, #8E07F8 100%)",
                  backdropFilter: "blur(200px)",
                  borderImage:
                    isLoading || !agreeToTerms || !firstName || !lastName || !email || !password || !confirmPassword || !companyName || !domain
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
                  "Create an account"
                )}
              </button>
            </div>
          </form>

          <div className="w-[640px] mx-auto my-3 flex items-center">
            <div className="flex-1 border-t border-[#EEEEEE]"></div>
            <span className="px-4 text-[14px] font-normal leading-[130%] tracking-[-0.05em] text-center text-[#444444] font-inter">
              OR
            </span>
            <div className="flex-1 border-t border-[#EEEEEE]"></div>
          </div>

          <div className="w-[640px] mx-auto">
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-[#D5D7DA] rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-[15px] font-normal leading-[130%] tracking-[-0.04em] text-center text-[#2E2E2E] font-inter">
                Sign up with Google
              </span>
            </button>
          </div>

          <div className="w-[640px] mx-auto mt-3 flex justify-center items-center">
            <p className="text-[14px] font-normal leading-5 tracking-[-0.5px] text-center text-gray-600 font-inter">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-[14px] font-medium leading-5 tracking-[-0.5px] text-center underline decoration-solid text-purple-600 hover:text-purple-700 font-inter transition-colors cursor-pointer"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;