"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Clock, Zap, Eye, Shield, Globe } from "lucide-react"
import { useThreats, useRealTimeData } from "@/hooks/use-api"
import { LoadingSpinner } from "./loading-spinner"
import { ThreatEvent } from "@/lib/types"

export function ThreatIntelligence() {
  const [threatFilter, setThreatFilter] = useState<string>("")
  
  // Fetch initial threat data
  const { data: initialThreats, loading, error } = useThreats({ 
    limit: 10, 
    severity: threatFilter || undefined 
  })

  // Set up real-time updates
  const { data: threats } = useRealTimeData(
    () => Promise.resolve(initialThreats || []),
    'threats:update',
    (currentData, newData) => {
      if (!currentData) return newData?.threats || []
      return newData?.threats || currentData
    }
  )

  if (loading) {
    return (
      <Card className="bg-white border-walmart-gray-200 shadow-walmart-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-walmart-blue">
            <div className="p-2 bg-red-100 rounded-xl">
              <Eye className="h-6 w-6 text-red-600" />
            </div>
            Threat Intelligence Center
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
      <Card className="bg-white border-walmart-gray-200 shadow-walmart-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-walmart-blue">
            <div className="p-2 bg-red-100 rounded-xl">
              <Eye className="h-6 w-6 text-red-600" />
            </div>
            Threat Intelligence Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center py-4">
            Failed to load threat data: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "blocked":
        return "bg-green-100 text-green-800 border-green-200"
      case "investigating":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const threatsList = threats || []

  return (
    <Card className="bg-white border-walmart-gray-200 shadow-walmart-md card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-walmart-blue">
          <div className="p-2 bg-red-100 rounded-xl">
            <Eye className="h-6 w-6 text-red-600" />
          </div>
          Threat Intelligence Center
          <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold animate-pulse">LIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Filter Controls */}
          <div className="flex gap-2 mb-4">
            {["", "critical", "high", "medium", "low"].map((severity) => (
              <Button
                key={severity}
                size="sm"
                variant={threatFilter === severity ? "default" : "outline"}
                onClick={() => setThreatFilter(severity)}
                className="text-xs"
              >
                {severity || "All"}
              </Button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-walmart-gray-50 p-4 rounded-xl text-center">
              <Shield className="h-6 w-6 text-walmart-blue mx-auto mb-2" />
              <p className="text-2xl font-bold text-walmart-blue">{threatsList.filter(t => t.status === 'BLOCKED').length}</p>
              <p className="text-xs text-walmart-gray-600">Threats Blocked</p>
            </div>
            <div className="bg-walmart-gray-50 p-4 rounded-xl text-center">
              <Globe className="h-6 w-6 text-walmart-spark-dark mx-auto mb-2" />
              <p className="text-2xl font-bold text-walmart-spark-dark">{new Set(threatsList.map(t => t.location)).size}</p>
              <p className="text-xs text-walmart-gray-600">Locations</p>
            </div>
            <div className="bg-walmart-gray-50 p-4 rounded-xl text-center">
              <Zap className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">0.08s</p>
              <p className="text-xs text-walmart-gray-600">Response Time</p>
            </div>
          </div>

          {/* Threat Feed */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {threatsList.length > 0 ? threatsList.map((threat) => (
              <div
                key={threat.id}
                className="bg-walmart-gray-50 p-4 rounded-xl border-l-4 border-l-red-400 hover:shadow-walmart-sm transition-all duration-300 animate-fade-in"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-walmart-gray-900 text-sm">{threat.type}</h4>
                      <p className="text-xs text-walmart-gray-600">{threat.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(threat.severity)} animate-pulse`} />
                    <Badge className={getStatusColor(threat.status)}>{threat.status?.toUpperCase()}</Badge>
                  </div>
                </div>

                <p className="text-sm text-walmart-gray-700 mb-3 leading-relaxed">{threat.description}</p>

                <div className="flex items-center justify-between text-xs text-walmart-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {threat.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(threat.detectedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-walmart-blue text-walmart-blue hover:bg-walmart-blue/10 micro-bounce bg-transparent"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Investigate
                  </Button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-walmart-gray-500">
                No threats found
              </div>
            )}
          </div>

          <Button className="w-full btn-walmart">View Complete Threat Analysis</Button>
        </div>
      </CardContent>
    </Card>
  )
}
