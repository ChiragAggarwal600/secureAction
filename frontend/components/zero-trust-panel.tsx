"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lock, UserCheck, Wifi, Database, Server, Globe } from "lucide-react"

interface AccessRequest {
  id: string
  user: string
  resource: string
  status: "approved" | "denied" | "pending"
  riskLevel: "low" | "medium" | "high"
  timestamp: Date
}

export function ZeroTrustPanel() {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const [trustScore, setTrustScore] = useState(87)
  const [verifiedSessions, setVerifiedSessions] = useState(1247)

  useEffect(() => {
    const generateRequest = (): AccessRequest => {
      const users = ["john.doe@walmart.com", "sarah.smith@walmart.com", "mike.johnson@walmart.com"]
      const resources = ["Payment Gateway", "Customer Database", "Inventory System", "Analytics Dashboard"]
      const statuses: ("approved" | "denied" | "pending")[] = ["approved", "denied", "pending"]
      const riskLevels: ("low" | "medium" | "high")[] = ["low", "medium", "high"]

      return {
        id: Math.random().toString(36).substr(2, 9),
        user: users[Math.floor(Math.random() * users.length)],
        resource: resources[Math.floor(Math.random() * resources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        timestamp: new Date(),
      }
    }

    const initialRequests = Array.from({ length: 5 }, generateRequest)
    setAccessRequests(initialRequests)

    const interval = setInterval(() => {
      setAccessRequests((prev) => {
        const newRequest = generateRequest()
        return [newRequest, ...prev.slice(0, 4)]
      })
      setTrustScore((prev) => Math.max(80, Math.min(95, prev + (Math.random() - 0.5) * 3)))
      setVerifiedSessions((prev) => prev + Math.floor(Math.random() * 5))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600/20 text-green-300 border-green-500/30"
      case "denied":
        return "bg-red-600/20 text-red-300 border-red-500/30"
      case "pending":
        return "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-gray-600/20 text-gray-300 border-gray-500/30"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Lock className="h-6 w-6 text-indigo-400" />
          Zero Trust Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-3 rounded-lg border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-slate-300">Trust Score</span>
            </div>
            <div className="text-xl font-bold text-white">{trustScore}%</div>
            <Progress value={trustScore} className="h-2 mt-2" />
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-3 rounded-lg border border-green-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Wifi className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-300">Verified Sessions</span>
            </div>
            <div className="text-xl font-bold text-white">{verifiedSessions}</div>
            <div className="text-xs text-green-400">Active now</div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Database className="h-4 w-4 text-indigo-400" />
            Access Requests
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {accessRequests.map((request) => (
              <div key={request.id} className="bg-slate-700/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{request.user.split("@")[0]}</span>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Server className="h-3 w-3" />
                    {request.resource}
                  </div>
                  <span className={`font-semibold ${getRiskColor(request.riskLevel)}`}>
                    {request.riskLevel.toUpperCase()} RISK
                  </span>
                </div>

                <div className="text-xs text-slate-400 mt-1">{request.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 p-3 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-blue-400" />
            <span className="text-white font-semibold text-sm">Network Status</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-green-400 font-semibold">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-semibold">2.3ms</div>
              <div className="text-slate-400">Latency</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-semibold">847</div>
              <div className="text-slate-400">Endpoints</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
