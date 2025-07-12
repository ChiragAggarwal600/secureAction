"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info, CheckCircle, X, Zap, Shield, Clock } from "lucide-react"
import { useAlerts, useRealTimeData } from "@/hooks/use-api"
import { AlertService } from "@/lib/api"
import { LoadingSpinner } from "./loading-spinner"
import { Alert } from "@/lib/types"

export function AlertCenter() {
  const [alertFilter, setAlertFilter] = useState<string>("")
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  
  // Fetch initial alerts
  const { data: initialAlerts, loading, error } = useAlerts({ 
    limit: 20,
    severity: alertFilter || undefined 
  })

  // Set up real-time updates for alerts
  const { data: alerts } = useRealTimeData(
    () => Promise.resolve(initialAlerts || []),
    'alerts:recent',
    (currentData, newData) => {
      if (!currentData) return newData?.alerts || []
      return newData?.alerts || currentData
    }
  )

  const dismissAlert = async (id: string) => {
    try {
      await AlertService.markAsRead(id)
      setDismissedAlerts(prev => new Set(prev).add(id))
    } catch (error) {
      console.error('Failed to dismiss alert:', error)
    }
  }

  const dismissAllAlerts = () => {
    const currentAlerts = alerts || []
    currentAlerts.forEach(alert => dismissAlert(alert.id))
  }

  if (loading && !alerts) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="h-6 w-6 text-red-400" />
            Security Alert Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="h-6 w-6 text-red-400" />
            Security Alert Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400 text-center py-4">
            Failed to load alerts: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getAlertIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      default:
        return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "info":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "success":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getBorderColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "critical":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      case "info":
        return "border-l-blue-500"
      case "success":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  const alertsList = alerts || []
  const activeAlerts = alertsList.filter((alert: Alert) => !dismissedAlerts.has(alert.id))
  const criticalCount = activeAlerts.filter((alert: Alert) => alert.severity === "CRITICAL").length
  const warningCount = activeAlerts.filter((alert: Alert) => alert.severity === "HIGH" || alert.severity === "MEDIUM").length

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Bell className="h-6 w-6 text-red-400" />
            Security Alert Center
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 font-semibold animate-pulse">
              {activeAlerts.length} ACTIVE
            </Badge>
          </div>
          {activeAlerts.length > 0 && (
            <Button
              onClick={dismissAllAlerts}
              size="sm"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
            >
              Dismiss All
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter Controls */}
        <div className="flex gap-2 mb-4">
          {["", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((severity) => (
            <Button
              key={severity}
              size="sm"
              variant={alertFilter === severity ? "default" : "outline"}
              onClick={() => setAlertFilter(severity)}
              className="text-xs"
            >
              {severity || "All"}
            </Button>
          ))}
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
            <AlertTriangle className="h-4 w-4 text-red-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-red-400">{criticalCount}</p>
            <p className="text-xs text-slate-400">Critical</p>
          </div>
          <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 text-center">
            <AlertTriangle className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-yellow-400">{warningCount}</p>
            <p className="text-xs text-slate-400">Warning</p>
          </div>
          <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-center">
            <Shield className="h-4 w-4 text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-400">{alertsList.length - activeAlerts.length}</p>
            <p className="text-xs text-slate-400">Resolved</p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activeAlerts.length > 0 ? activeAlerts.map((alert: Alert) => (
            <div
              key={alert.id}
              className={`bg-slate-800/30 p-4 rounded-lg border-l-4 ${getBorderColor(alert.severity)} hover:bg-slate-800/50 transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.severity)}
                  <div>
                    <h4 className="font-semibold text-white text-sm">{alert.title}</h4>
                    <p className="text-xs text-slate-400">{alert.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getAlertColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <Button
                    onClick={() => dismissAlert(alert.id)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-slate-700/50"
                  >
                    <X className="h-3 w-3 text-slate-400" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-3 leading-relaxed">{alert.message}</p>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(alert.createdAt).toLocaleTimeString()}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Investigate
                </Button>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <p>All alerts resolved</p>
              <p className="text-xs text-slate-500">System security status: Normal</p>
            </div>
          )}
        </div>

        {activeAlerts.length > 3 && (
          <Button
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
          >
            View All Alerts ({activeAlerts.length})
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
