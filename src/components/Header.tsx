import React from "react";
import { Button } from "@/components/ui/Button";
import { UserButton } from "@clerk/nextjs";
import { Home, List, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      {/* App Title */}
      <div className="text-2xl font-bold text-gray-800">Progress Tracker</div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-8">
        {/* Home Button */}
        <button className="text-gray-700 hover:text-blue-500 flex items-center space-x-1">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Tasks Button */}
        <button className="text-gray-700 hover:text-blue-500 flex items-center space-x-1">
          <List className="w-5 h-5" />
          <span>Tasks</span>
        </button>

        {/* Profile Button */}
        <button className="text-gray-700 hover:text-blue-500 flex items-center space-x-1">
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-4">
        {/* User Button for Account Settings */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
