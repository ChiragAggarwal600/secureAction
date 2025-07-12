"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Lock, UserCheck, Wifi, Database, Server, Globe, Shield, AlertTriangle } from "lucide-react"

interface AccessRequest {
  id: string
  user: string
  resource: string
  status: "approved" | "denied" | "pending"
  riskLevel: "low" | "medium" | "high"
  timestamp: Date
  department: string
}

export function ZeroTrustCenter() {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const [trustScore, setTrustScore] = useState(92)
  const [verifiedSessions, setVerifiedSessions] = useState(1847)
  const [securityPolicies, setSecurityPolicies] = useState(47)

  useEffect(() => {
    const generateRequest = (): AccessRequest => {
      const users = ["john.doe", "sarah.chen", "mike.rodriguez", "lisa.wang", "david.kim"]
      const resources = [
        "Payment Gateway",
        "Customer Database",
        "Inventory System",
        "Analytics Dashboard",
        "Admin Panel",
      ]
      const statuses: ("approved" | "denied" | "pending")[] = ["approved", "denied", "pending"]
      const riskLevels: ("low" | "medium" | "high")[] = ["low", "medium", "high"]
      const departments = ["IT Security", "Finance", "Operations", "Analytics", "Customer Service"]

      return {
        id: Math.random().toString(36).substr(2, 9),
        user: users[Math.floor(Math.random() * users.length)],
        resource: resources[Math.floor(Math.random() * resources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        timestamp: new Date(),
        department: departments[Math.floor(Math.random() * departments.length)],
      }
    }

    const initialRequests = Array.from({ length: 4 }, generateRequest)
    setAccessRequests(initialRequests)

    const interval = setInterval(() => {
      setAccessRequests((prev) => {
        const newRequest = generateRequest()
        return [newRequest, ...prev.slice(0, 3)]
      })
      setTrustScore((prev) => Math.max(85, Math.min(98, prev + (Math.random() - 0.5) * 2)))
      setVerifiedSessions((prev) => prev + Math.floor(Math.random() * 8))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "denied":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="bg-white border-walmart-gray-200 shadow-walmart-md card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-walmart-blue">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
          Zero Trust Security Center
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 font-semibold">ACTIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trust Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-4 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-walmart-gray-900 text-sm">Trust Score</span>
              </div>
              <Shield className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-black text-indigo-600">{trustScore}%</p>
            <Progress value={trustScore} className="h-2 mt-2 bg-indigo-200" />
            <p className="text-xs text-walmart-gray-600 mt-1">Network confidence</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-walmart-gray-900 text-sm">Active Sessions</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-black text-green-600">{verifiedSessions.toLocaleString()}</p>
            <p className="text-xs text-walmart-gray-600">Verified connections</p>
          </div>
        </div>

        {/* Security Policies */}
        <div className="bg-walmart-gray-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-walmart-blue" />
              <span className="font-bold text-walmart-gray-900">Security Policies</span>
            </div>
            <Badge className="bg-walmart-blue/10 text-walmart-blue border-walmart-blue/20">
              {securityPolicies} Active
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-walmart-gray-600">MFA Required</span>
              <span className="font-semibold text-green-600">✓ Enabled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-walmart-gray-600">Device Trust</span>
              <span className="font-semibold text-green-600">✓ Verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-walmart-gray-600">Location Check</span>
              <span className="font-semibold text-green-600">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-walmart-gray-600">Time-based Access</span>
              <span className="font-semibold text-green-600">✓ Enforced</span>
            </div>
          </div>
        </div>

        {/* Access Requests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-walmart-gray-900 flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-600" />
              Recent Access Requests
            </h4>
            <Button
              variant="outline"
              size="sm"
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 bg-transparent"
            >
              Manage
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {accessRequests.map((request) => (
              <div
                key={request.id}
                className="bg-walmart-gray-50 p-3 rounded-xl hover:shadow-walmart-sm transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-walmart-gradient rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{request.user.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-walmart-gray-900 text-sm">{request.user}</p>
                      <p className="text-xs text-walmart-gray-600">{request.department}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(request.status)}>{request.status.toUpperCase()}</Badge>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-walmart-gray-600">
                    <Server className="h-3 w-3" />
                    <span>{request.resource}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-3 w-3 ${getRiskColor(request.riskLevel)}`} />
                    <span className={`font-semibold ${getRiskColor(request.riskLevel)}`}>
                      {request.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-walmart-gray-500 mt-1">{request.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Status */}
        <div className="bg-gradient-to-r from-walmart-blue/5 via-indigo-50 to-walmart-blue/5 p-4 rounded-xl border border-walmart-blue/20">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-walmart-blue" />
            <span className="font-bold text-walmart-gray-900 text-sm">Network Security Status</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="text-green-600 font-bold text-lg">99.9%</div>
              <div className="text-walmart-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-walmart-blue font-bold text-lg">1.2ms</div>
              <div className="text-walmart-gray-600">Latency</div>
            </div>
            <div className="text-center">
              <div className="text-purple-600 font-bold text-lg">2,847</div>
              <div className="text-walmart-gray-600">Endpoints</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
