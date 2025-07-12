"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Settings, User, Shield, Zap, Globe, ChevronDown } from "lucide-react"

export function WalmartHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState(7)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-white border-b border-walmart-gray-200 shadow-walmart-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              {/* Walmart Spark Logo */}
              <div className="relative">
                <div className="w-12 h-12 walmart-gradient rounded-xl flex items-center justify-center shadow-walmart-md spark-pulse">
                  <div className="w-6 h-6 bg-walmart-spark rounded-full relative">
                    <div className="absolute inset-0 bg-walmart-spark rounded-full animate-ping opacity-75"></div>
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-walmart-blue tracking-tight">CyberShield</h1>
                <p className="text-sm text-walmart-gray-500 font-medium">Security Operations Center</p>
              </div>
            </div>

            {/* Navigation Pills */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Button variant="ghost" className="text-walmart-blue font-semibold bg-walmart-blue/10">
                <Shield className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" className="text-walmart-gray-600 hover:text-walmart-blue">
                <Zap className="w-4 h-4 mr-2" />
                Threats
              </Button>
              <Button variant="ghost" className="text-walmart-gray-600 hover:text-walmart-blue">
                <Globe className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </nav>
          </div>

          {/* Status and Controls */}
          <div className="flex items-center space-x-6">
            {/* System Status */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-walmart-gray-700">All Systems Operational</span>
              </div>

              <div className="text-sm text-walmart-gray-500 font-mono">
                {currentTime.toLocaleTimeString("en-US", {
                  timeZone: "America/Chicago",
                  hour12: false,
                })}{" "}
                CST
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative hover:bg-walmart-blue/10 micro-bounce">
                <Bell className="w-5 h-5 text-walmart-gray-600" />
                {notifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                    {notifications}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="sm" className="hover:bg-walmart-blue/10 micro-bounce">
                <Settings className="w-5 h-5 text-walmart-gray-600" />
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-walmart-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-walmart-gray-900">Sarah Chen</p>
                  <p className="text-xs text-walmart-gray-500">Security Analyst</p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-walmart-blue/10 micro-bounce"
                >
                  <div className="w-8 h-8 bg-walmart-gradient rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-walmart-gray-400" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
