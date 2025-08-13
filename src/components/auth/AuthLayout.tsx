import type { ReactNode } from "react";
import Carousel from "./Carousel";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Carousel />
      <div className="w-full lg:w-3/5 flex items-center justify-start px-4 sm:px-8 md:px-12 lg:pl-20 lg:pr-8 py-8 bg-white">
        <div className="w-full max-w-lg mx-auto lg:mx-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;