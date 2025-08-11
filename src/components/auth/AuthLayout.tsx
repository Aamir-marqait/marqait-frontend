import type { ReactNode } from "react";
import Carousel from "./Carousel";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <Carousel />
      <div className="w-full lg:w-3/5 flex items-center justify-start pl-20 pr-8 py-8 bg-white">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;