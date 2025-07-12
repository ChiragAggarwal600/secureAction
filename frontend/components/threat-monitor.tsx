"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye, MapPin, Clock, Zap } from "lucide-react"

interface ThreatEvent {
  id: string
  type: string
  severity: "critical" | "high" | "medium" | "low"
  location: string
  timestamp: Date
  description: string
  blocked: boolean
}

export function ThreatMonitor() {
  const [threats, setThreats] = useState<ThreatEvent[]>([])

  useEffect(() => {
    const generateThreat = (): ThreatEvent => {
      const types = ["SQL Injection", "DDoS Attack", "Credential Stuffing", "API Abuse", "Malware Detection"]
      const severities: ("critical" | "high" | "medium" | "low")[] = ["critical", "high", "medium", "low"]
      const locations = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ"]

      return {
        id: Math.random().toString(36).substr(2, 9),
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: new Date(),
        description: "Automated threat detection and response initiated",
        blocked: Math.random() > 0.2,
      }
    }

    const initialThreats = Array.from({ length: 5 }, generateThreat)
    setThreats(initialThreats)

    const interval = setInterval(() => {
      setThreats((prev) => {
        const newThreat = generateThreat()
        return [newThreat, ...prev.slice(0, 9)]
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Eye className="h-6 w-6 text-red-400" />
          Real-Time Threat Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {threats.map((threat) => (
            <div key={threat.id} className="bg-slate-700/30 p-4 rounded-lg border-l-4 border-l-red-400">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="font-semibold text-white">{threat.type}</span>
                  <div className={`w-2 h-2 rounded-full ${getSeverityColor(threat.severity)}`} />
                </div>
                <Badge variant={threat.blocked ? "default" : "destructive"}>
                  {threat.blocked ? "Blocked" : "Active"}
                </Badge>
              </div>

              <p className="text-sm text-slate-300 mb-3">{threat.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {threat.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {threat.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                  <Zap className="h-3 w-3 mr-1" />
                  Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
