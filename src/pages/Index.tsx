import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { UserRole } from "@/types";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Users,
  Settings,
} from "lucide-react";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentStock, setCurrentStock] = useState(0);
  const [isSignupMode, setIsSignupMode] = useState(false);

  const mockStocks = [
    {
      name: "APPLE",
      price: "₹182.52",
      change: "+2.34%",
      color: "text-green-600",
    },
    {
      name: "GOOGEL",
      price: "₹142.89",
      change: "-1.12%",
      color: "text-red-600",
    },
    {
      name: "MSFT",
      price: "₹378.85",
      change: "+0.89%",
      color: "text-green-600",
    },
    {
      name: "TESLA",
      price: "₹248.42",
      change: "+4.67%",
      color: "text-green-600",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStock((prev) => (prev + 1) % mockStocks.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Navigation will be handled by the Navigate component below
    }
  }, [isAuthenticated, user]);

  if (isAuthenticated && user) {
    console.log("User authenticated:", user); // Debug log
    const redirectPath = (user.role === UserRole.ADMIN || user.role === "admin") ? "/admin" : "/dashboard";
    console.log("Redirecting to:", redirectPath);
    return (
      <Navigate to={redirectPath} replace />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="relative z-10">
        {/* Header */}
        <nav className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Grip Invest</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
            <span>Pranav Nair</span>
            <span>•</span>
            <span>Resume Here</span>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Stock Trading
                  <span className="block text-blue-400">Made Simple</span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed">
                  A clean, modern trading platform with admin controls. Built
                  for Grip Invest's winter internship assignment.
                </p>
              </div>

              {/* Live Stock Ticker */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Live Demo Data
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Updating</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {mockStocks.map((stock, index) => (
                    <div
                      key={stock.name}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        index === currentStock
                          ? "bg-blue-500/20 border border-blue-500/30 scale-105"
                          : "bg-slate-700/30"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-white font-semibold">
                          {stock.name}
                        </span>
                        <span className="text-gray-300">{stock.price}</span>
                      </div>
                      <div className={`text-sm ${stock.color} font-medium`}>
                        {stock.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-colors">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">
                    Portfolio Tracking
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Real-time portfolio analytics
                  </p>
                </div>

                <div className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-500/30 transition-colors">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">
                    Virtual Trading
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Practice with virtual money
                  </p>
                </div>

                <div className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition-colors">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">Multi-User</h4>
                  <p className="text-gray-400 text-sm">
                    Admin & customer roles
                  </p>
                </div>

                <div className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-500/30 transition-colors">
                    <Settings className="w-5 h-5 text-orange-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">Admin Panel</h4>
                  <p className="text-gray-400 text-sm">Manage stocks & users</p>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="flex flex-col items-center space-y-6">
              <div className="w-full max-w-md">
                {isSignupMode ? <SignupForm /> : <LoginForm />}
              </div>

              {/* Toggle between Login and Signup */}
              <div className="w-full max-w-md text-center">
                <p className="text-gray-400 text-sm">
                  {isSignupMode ? "Already have an account?" : "Don't have an account?"}
                  <button
                    onClick={() => setIsSignupMode(!isSignupMode)}
                    className="text-blue-400 hover:text-blue-300 ml-2 font-medium transition-colors"
                  >
                    {isSignupMode ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="w-full max-w-md bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <PieChart className="w-4 h-4 mr-2 text-blue-400" />
                  Quick Demo Access
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <div className="text-blue-400 font-medium text-sm">
                        Customer
                      </div>
                      <div className="text-gray-300 text-xs">
                        customer / password
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <div className="text-green-400 font-medium text-sm">
                        Admin
                      </div>
                      <div className="text-gray-300 text-xs">
                        admin / password
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Settings className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 bg-slate-800/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                Email: work.pranavnair@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
