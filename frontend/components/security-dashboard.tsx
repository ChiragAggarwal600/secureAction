"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Activity, AlertTriangle, CheckCircle, TrendingUp, Globe } from "lucide-react"
import { useSecurityOverview } from "@/hooks/use-api"
import { websocketService } from "@/lib/api"

export function SecurityDashboard() {
  const { data: securityData, loading, error, refetch } = useSecurityOverview()

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    websocketService.connect()

    // Subscribe to security updates
    const unsubscribe = websocketService.subscribe('security_update', () => {
      refetch() // Refresh data when security updates are received
    })

    return () => {
      unsubscribe()
    }
  }, [refetch])

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-6 w-6 text-blue-400" />
            Security Command Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-400">Loading security data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-6 w-6 text-blue-400" />
            Security Command Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-400">Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const securityScore = securityData?.securityScore || 0
  const activeThreats = securityData?.activeThreats || 0
  const blockedAttacks = securityData?.blockedToday || 0
  const protectedTransactions = securityData?.protectedTransactions || 0

  // Static threat data for display (can be made dynamic with additional API endpoint)
  const threatLevels = [
    { name: "Payment Fraud", level: "High", count: 12, color: "bg-red-500" },
    { name: "Data Breach Attempts", level: "Medium", count: 8, color: "bg-yellow-500" },
    { name: "Identity Theft", level: "Low", count: 3, color: "bg-green-500" },
    { name: "API Vulnerabilities", level: "Medium", count: 5, color: "bg-yellow-500" },
  ]

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-6 w-6 text-blue-400" />
          Security Command Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Security Score</span>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">{securityScore}%</div>
            <Progress value={securityScore} className="h-2" />
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Active Threats</span>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">{activeThreats}</div>
            <div className="text-xs text-slate-400">Real-time monitoring</div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Blocked Today</span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{blockedAttacks.toLocaleString()}</div>
            <div className="text-xs text-green-400">+12% from yesterday</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Threat Categories
          </h3>
          <div className="space-y-3">
            {threatLevels.map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${threat.color}`} />
                  <span className="text-white font-medium">{threat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      threat.level === "High" ? "destructive" : threat.level === "Medium" ? "default" : "secondary"
                    }
                  >
                    {threat.level}
                  </Badge>
                  <span className="text-slate-300 text-sm">{threat.count} incidents</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/30">
            <Globe className="h-8 w-8 text-blue-400 mb-2" />
            <div className="text-sm text-slate-300">Global Coverage</div>
            <div className="text-xl font-bold text-white">99.9% Uptime</div>
          </div>
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 rounded-lg border border-green-500/30">
            <Shield className="h-8 w-8 text-green-400 mb-2" />
            <div className="text-sm text-slate-300">AI Protection</div>
            <div className="text-xl font-bold text-white">Active</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
