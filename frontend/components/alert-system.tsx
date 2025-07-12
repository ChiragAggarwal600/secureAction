"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info, CheckCircle, X } from "lucide-react"

interface Alert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: Date
  dismissed: boolean
}

export function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const generateAlert = (): Alert => {
      const types: ("critical" | "warning" | "info" | "success")[] = ["critical", "warning", "info", "success"]
      const alertTemplates = [
        { type: "critical", title: "Security Breach Detected", message: "Unauthorized access attempt blocked" },
        { type: "warning", title: "High Traffic Volume", message: "Unusual traffic patterns detected" },
        { type: "info", title: "System Update", message: "Security patches applied successfully" },
        { type: "success", title: "Threat Neutralized", message: "Malware attempt successfully blocked" },
        { type: "warning", title: "Failed Login Attempts", message: "Multiple failed login attempts detected" },
      ]

      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)]

      return {
        id: Math.random().toString(36).substr(2, 9),
        type: template.type as "critical" | "warning" | "info" | "success",
        title: template.title,
        message: template.message,
        timestamp: new Date(),
        dismissed: false,
      }
    }

    const initialAlerts = Array.from({ length: 3 }, generateAlert)
    setAlerts(initialAlerts)

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setAlerts((prev) => {
          const newAlert = generateAlert()
          return [newAlert, ...prev.slice(0, 4)]
        })
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, dismissed: true } : alert)))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      default:
        return null
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-l-red-500 bg-red-500/10"
      case "warning":
        return "border-l-yellow-500 bg-yellow-500/10"
      case "info":
        return "border-l-blue-500 bg-blue-500/10"
      case "success":
        return "border-l-green-500 bg-green-500/10"
      default:
        return "border-l-gray-500 bg-gray-500/10"
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "default"
      case "info":
        return "secondary"
      case "success":
        return "default"
      default:
        return "secondary"
    }
  }

  const activeAlerts = alerts.filter((alert) => !alert.dismissed)

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Bell className="h-6 w-6 text-orange-400" />
          Security Alerts
          {activeAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {activeAlerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <p>All systems secure</p>
              <p className="text-sm">No active alerts</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <span className="font-semibold text-white text-sm">{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                      {alert.type.toUpperCase()}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mb-2">{alert.message}</p>

                <div className="text-xs text-slate-400">{alert.timestamp.toLocaleTimeString()}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
