import React from "react";
import { ProfileSidebar } from "./ProfileSidebar";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f5f5] py-8 font-sans">
      <div className="container mx-auto px-4 max-w-[1100px] flex flex-col lg:flex-row gap-6">
        {/* Main Content (Left Column) */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Sidebar (Right Column) */}
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
};
