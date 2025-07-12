"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Fingerprint, Eye, Scan, CheckCircle, AlertCircle } from "lucide-react"
import { useBiometricData, useRealTimeData } from "@/hooks/use-api"
import { BiometricService } from "@/lib/api"
import { LoadingSpinner } from "./loading-spinner"

export function BiometricAuth() {
  const [isScanning, setIsScanning] = useState(false)
  const [authStatus, setAuthStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle")
  const [confidence, setConfidence] = useState(0)

  // Fetch biometric data
  const { data: biometricData, loading, error } = useBiometricData()

  // Set up real-time updates for biometric data
  const { data: realTimeBiometricData } = useRealTimeData(
    () => Promise.resolve(biometricData),
    'biometric:update',
    (currentData, newData) => newData || currentData
  )

  const currentBiometricData = realTimeBiometricData || biometricData

  if (loading && !currentBiometricData) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Fingerprint className="h-6 w-6 text-emerald-400" />
            Biometric Authentication
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
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Fingerprint className="h-6 w-6 text-emerald-400" />
            Biometric Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400 text-center py-4">
            Failed to load biometric data: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  const startBiometricScan = () => {
    setIsScanning(true)
    setAuthStatus("scanning")
    setConfidence(0)

    const interval = setInterval(() => {
      setConfidence((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          const success = Math.random() > 0.1
          setAuthStatus(success ? "success" : "failed")
          setTimeout(() => setAuthStatus("idle"), 3000)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const authenticatedUsers = currentBiometricData?.authenticatedUsers || 2847
  const biometricMethods = currentBiometricData?.methods || [
    { name: "Fingerprint", icon: Fingerprint, active: 1247, accuracy: 99.2, type: "fingerprint" },
    { name: "Facial Recognition", icon: Eye, active: 892, accuracy: 98.7, type: "facial" },
    { name: "Iris Scan", icon: Scan, active: 456, accuracy: 99.8, type: "iris" },
  ]

  // Map icon components for each method type
  const getMethodIcon = (type: string) => {
    switch (type) {
      case "fingerprint":
        return Fingerprint
      case "facial":
        return Eye
      case "iris":
        return Scan
      default:
        return Fingerprint
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Fingerprint className="h-6 w-6 text-emerald-400" />
          Biometric Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 p-4 rounded-lg border border-emerald-500/30 text-center">
          <div className="text-2xl font-bold text-white mb-1">{authenticatedUsers.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Authenticated Today</div>
        </div>

        <div className="space-y-3">
          {biometricMethods.map((method: any, index: number) => {
            const IconComponent = getMethodIcon(method.type)
            return (
              <div key={index} className="bg-slate-700/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-emerald-400" />
                    <span className="text-white font-medium">{method.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-300">
                    {method.accuracy.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{method.active} active sessions</span>
                  <Progress value={method.accuracy} className="w-20 h-2" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-slate-600 pt-4">
          <div className="text-center mb-4">
            {authStatus === "idle" && <div className="text-slate-300">Ready for biometric scan</div>}
            {authStatus === "scanning" && <div className="text-blue-400">Scanning... {confidence.toFixed(0)}%</div>}
            {authStatus === "success" && (
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                Authentication Successful
              </div>
            )}
            {authStatus === "failed" && (
              <div className="flex items-center justify-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                Authentication Failed
              </div>
            )}
          </div>

          {authStatus === "scanning" && <Progress value={confidence} className="mb-4" />}

          <Button
            onClick={startBiometricScan}
            disabled={isScanning}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isScanning ? "Scanning..." : "Start Biometric Scan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
