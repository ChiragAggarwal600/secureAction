"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Globe,
  Zap,
  Lock,
  Eye,
  BarChart3,
} from "lucide-react"

export function SecurityOverview() {
  const [securityScore, setSecurityScore] = useState(96.8)
  const [activeThreats, setActiveThreats] = useState(2)
  const [blockedToday, setBlockedToday] = useState(3247)
  const [protectedTransactions, setProtectedTransactions] = useState(847293)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityScore((prev) => Math.max(94, Math.min(99, prev + (Math.random() - 0.5) * 0.5)))
      setActiveThreats((prev) => Math.max(0, Math.min(8, prev + Math.floor((Math.random() - 0.8) * 3))))
      setBlockedToday((prev) => prev + Math.floor(Math.random() * 3))
      setProtectedTransactions((prev) => prev + Math.floor(Math.random() * 50))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const threatCategories = [
    {
      name: "Payment Fraud Attempts",
      count: 156,
      severity: "high",
      trend: "+12%",
      color: "bg-red-500",
      icon: AlertTriangle,
    },
    {
      name: "API Security Violations",
      count: 89,
      severity: "medium",
      trend: "-8%",
      color: "bg-yellow-500",
      icon: Lock,
    },
    {
      name: "Identity Verification Failures",
      count: 34,
      severity: "low",
      trend: "-15%",
      color: "bg-green-500",
      icon: Eye,
    },
    {
      name: "Network Intrusion Attempts",
      count: 67,
      severity: "medium",
      trend: "+5%",
      color: "bg-orange-500",
      icon: Globe,
    },
  ]

  return (
    <Card className="bg-white border-walmart-gray-200 shadow-walmart-lg card-hover">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-walmart-blue">
            <div className="p-2 bg-walmart-blue/10 rounded-xl">
              <Shield className="h-7 w-7 text-walmart-blue" />
            </div>
            Walmart Security Command Center
          </CardTitle>

          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              SECURE
            </Badge>
            <Button size="sm" className="btn-walmart micro-bounce">
              <BarChart3 className="w-4 h-4 mr-2" />
              Full Report
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-walmart-blue/5 to-walmart-blue/10 p-6 rounded-2xl border border-walmart-blue/20 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-walmart-blue/10 rounded-xl">
                <CheckCircle className="h-6 w-6 text-walmart-blue" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-walmart-gray-600">Security Score</p>
              <p className="text-3xl font-black text-walmart-blue">{securityScore.toFixed(1)}%</p>
              <Progress value={securityScore} className="h-2 bg-walmart-gray-200" />
              <p className="text-xs text-green-600 font-semibold">+2.3% from last week</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-xs font-semibold text-red-600 bg-red-200 px-2 py-1 rounded-full">ACTIVE</div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-walmart-gray-600">Active Threats</p>
              <p className="text-3xl font-black text-red-600">{activeThreats}</p>
              <p className="text-xs text-walmart-gray-500">Real-time monitoring</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-walmart-spark/10 to-walmart-spark/20 p-6 rounded-2xl border border-walmart-spark/30 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-walmart-spark/20 rounded-xl">
                <Zap className="h-6 w-6 text-walmart-spark-dark" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-walmart-gray-600">Blocked Today</p>
              <p className="text-3xl font-black text-walmart-spark-dark">{blockedToday.toLocaleString()}</p>
              <p className="text-xs text-green-600 font-semibold">+18% from yesterday</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-xs font-semibold text-green-600 bg-green-200 px-2 py-1 rounded-full">LIVE</div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-walmart-gray-600">Protected Transactions</p>
              <p className="text-3xl font-black text-green-600">{protectedTransactions.toLocaleString()}</p>
              <p className="text-xs text-walmart-gray-500">Since midnight</p>
            </div>
          </div>
        </div>

        {/* Threat Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-walmart-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-walmart-blue" />
              Threat Intelligence Overview
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="border-walmart-blue text-walmart-blue hover:bg-walmart-blue/10 bg-transparent"
            >
              View All Threats
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threatCategories.map((threat, index) => (
              <div
                key={index}
                className="bg-walmart-gray-50 p-5 rounded-xl border border-walmart-gray-200 hover:shadow-walmart-md transition-all duration-300 card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${threat.color} animate-pulse`} />
                    <threat.icon className="h-4 w-4 text-walmart-gray-600" />
                    <span className="font-semibold text-walmart-gray-900">{threat.name}</span>
                  </div>
                  <Badge
                    variant={
                      threat.severity === "high"
                        ? "destructive"
                        : threat.severity === "medium"
                          ? "default"
                          : "secondary"
                    }
                    className="font-semibold"
                  >
                    {threat.severity.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-walmart-gray-900">{threat.count}</span>
                    <span className="text-sm text-walmart-gray-500">incidents detected</span>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      threat.trend.startsWith("+") ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {threat.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status Bar */}
        <div className="bg-gradient-to-r from-walmart-blue/5 via-walmart-spark/5 to-walmart-blue/5 p-6 rounded-2xl border border-walmart-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Globe className="h-8 w-8 text-walmart-blue mx-auto mb-2" />
              <p className="text-sm font-medium text-walmart-gray-600">Global Coverage</p>
              <p className="text-xl font-bold text-walmart-blue">99.99%</p>
              <p className="text-xs text-green-600">Uptime</p>
            </div>

            <div className="text-center">
              <Shield className="h-8 w-8 text-walmart-spark-dark mx-auto mb-2" />
              <p className="text-sm font-medium text-walmart-gray-600">AI Protection</p>
              <p className="text-xl font-bold text-walmart-spark-dark">Active</p>
              <p className="text-xs text-walmart-gray-500">24/7 Monitoring</p>
            </div>

            <div className="text-center">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-walmart-gray-600">Response Time</p>
              <p className="text-xl font-bold text-green-600">0.12s</p>
              <p className="text-xs text-green-600">Average</p>
            </div>

            <div className="text-center">
              <Lock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-walmart-gray-600">Encryption</p>
              <p className="text-xl font-bold text-purple-600">AES-256</p>
              <p className="text-xs text-walmart-gray-500">Military Grade</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
