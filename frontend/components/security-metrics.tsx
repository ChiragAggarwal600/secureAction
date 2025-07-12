"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Target, Zap, Shield, Activity } from "lucide-react"

export function SecurityMetrics() {
  const [metrics, setMetrics] = useState({
    responseTime: 0.18,
    threatsPrevented: 99.8,
    systemUptime: 99.99,
    dataIntegrity: 100,
    complianceScore: 97.8,
    incidentResolution: 94.2,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        responseTime: Math.max(0.05, Math.min(0.5, prev.responseTime + (Math.random() - 0.5) * 0.05)),
        threatsPrevented: Math.max(98, Math.min(100, prev.threatsPrevented + (Math.random() - 0.5) * 0.3)),
        systemUptime: Math.max(99.8, Math.min(100, prev.systemUptime + (Math.random() - 0.5) * 0.05)),
        dataIntegrity: Math.max(99.9, Math.min(100, prev.dataIntegrity + (Math.random() - 0.5) * 0.05)),
        complianceScore: Math.max(95, Math.min(100, prev.complianceScore + (Math.random() - 0.5) * 0.4)),
        incidentResolution: Math.max(90, Math.min(98, prev.incidentResolution + (Math.random() - 0.5) * 0.6)),
      }))
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const metricItems = [
    {
      name: "Response Time",
      value: `${metrics.responseTime.toFixed(2)}s`,
      percentage: Math.max(0, 100 - metrics.responseTime * 200),
      trend: "down",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: Zap,
    },
    {
      name: "Threats Prevented",
      value: `${metrics.threatsPrevented.toFixed(1)}%`,
      percentage: metrics.threatsPrevented,
      trend: "up",
      color: "text-walmart-blue",
      bgColor: "bg-walmart-blue/5",
      borderColor: "border-walmart-blue/20",
      icon: Shield,
    },
    {
      name: "System Uptime",
      value: `${metrics.systemUptime.toFixed(2)}%`,
      percentage: metrics.systemUptime,
      trend: "up",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      icon: Activity,
    },
    {
      name: "Data Integrity",
      value: `${metrics.dataIntegrity.toFixed(1)}%`,
      percentage: metrics.dataIntegrity,
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      icon: Target,
    },
  ]

  return (
    <Card className="bg-white border-walmart-gray-200 shadow-walmart-md card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-walmart-blue">
          <div className="p-2 bg-walmart-blue/10 rounded-xl">
            <BarChart3 className="h-6 w-6 text-walmart-blue" />
          </div>
          Security Performance Metrics
          <Badge className="bg-walmart-blue/10 text-walmart-blue border-walmart-blue/20 font-semibold">REAL-TIME</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Performance Indicators */}
        <div className="space-y-4">
          {metricItems.map((metric, index) => (
            <div
              key={index}
              className={`${metric.bgColor} p-4 rounded-xl ${metric.borderColor} border hover:shadow-walmart-sm transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${metric.bgColor} rounded-lg ${metric.borderColor} border`}>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                  <span className="font-semibold text-walmart-gray-900">{metric.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${metric.color}`}>{metric.value}</span>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
              <Progress value={metric.percentage} className="h-2" />
              <div className="flex justify-between text-xs text-walmart-gray-600 mt-2">
                <span>Target: 95%</span>
                <span className="font-semibold">Current: {metric.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance & Resolution Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-walmart-spark/10 p-4 rounded-xl border border-walmart-spark/30">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="h-5 w-5 text-walmart-spark-dark" />
              <span className="font-bold text-walmart-gray-900 text-sm">Compliance Score</span>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-walmart-spark-dark">{metrics.complianceScore.toFixed(1)}%</p>
              <Progress value={metrics.complianceScore} className="h-2 bg-walmart-spark/20" />
              <p className="text-xs text-walmart-gray-600">SOC 2, PCI DSS, GDPR</p>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-indigo-600" />
              <span className="font-bold text-walmart-gray-900 text-sm">Incident Resolution</span>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-indigo-600">{metrics.incidentResolution.toFixed(1)}%</p>
              <Progress value={metrics.incidentResolution} className="h-2 bg-indigo-200" />
              <p className="text-xs text-walmart-gray-600">Within SLA targets</p>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-r from-walmart-blue/5 via-walmart-spark/5 to-walmart-blue/5 p-5 rounded-xl border border-walmart-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Activity className="h-6 w-6 text-walmart-blue mx-auto mb-2" />
              <p className="text-sm font-medium text-walmart-gray-600">Security Events</p>
              <p className="text-xl font-bold text-walmart-blue">4,247</p>
              <p className="text-xs text-walmart-gray-500">Processed today</p>
            </div>

            <div className="text-center">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-walmart-gray-600">Threats Blocked</p>
              <p className="text-xl font-bold text-green-600">1,847</p>
              <p className="text-xs text-green-600">+15% efficiency</p>
            </div>

            <div className="text-center">
              <Zap className="h-6 w-6 text-walmart-spark-dark mx-auto mb-2" />
              <p className="text-sm font-medium text-walmart-gray-600">Avg Response</p>
              <p className="text-xl font-bold text-walmart-spark-dark">0.18s</p>
              <p className="text-xs text-walmart-gray-500">Lightning fast</p>
            </div>

            <div className="text-center">
              <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-walmart-gray-600">Efficiency</p>
              <p className="text-xl font-bold text-purple-600">98.7%</p>
              <p className="text-xs text-green-600">Above target</p>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-walmart-gray-50 p-4 rounded-xl">
          <h4 className="font-bold text-walmart-gray-900 mb-2 text-sm">Performance Insights</h4>
          <div className="space-y-2 text-sm text-walmart-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All security metrics performing above baseline targets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-walmart-blue rounded-full"></div>
              <span>Response time improved by 23% this quarter</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-walmart-spark rounded-full"></div>
              <span>Zero critical security incidents in the last 30 days</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
