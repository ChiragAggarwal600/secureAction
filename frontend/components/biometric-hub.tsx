"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Fingerprint, Eye, Scan, CheckCircle, AlertCircle, Users, Shield, Zap } from "lucide-react"

export function BiometricHub() {
  const [isScanning, setIsScanning] = useState(false)
  const [authStatus, setAuthStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle")
  const [confidence, setConfidence] = useState(0)
  const [authenticatedUsers, setAuthenticatedUsers] = useState(3247)

  const startBiometricScan = () => {
    setIsScanning(true)
    setAuthStatus("scanning")
    setConfidence(0)

    const interval = setInterval(() => {
      setConfidence((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          const success = Math.random() > 0.08
          setAuthStatus(success ? "success" : "failed")
          if (success) {
            setAuthenticatedUsers((prev) => prev + 1)
          }
          setTimeout(() => setAuthStatus("idle"), 4000)
          return 100
        }
        return prev + Math.random() * 12
      })
    }, 150)
  }

  const biometricMethods = [
    {
      name: "Fingerprint",
      icon: Fingerprint,
      active: 1847,
      accuracy: 99.4,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      name: "Facial Recognition",
      icon: Eye,
      active: 1234,
      accuracy: 98.9,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      name: "Iris Scanning",
      icon: Scan,
      active: 567,
      accuracy: 99.8,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ]

  return (
    <Card className="bg-white border-walmart-gray-200 shadow-walmart-md card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-walmart-blue">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Fingerprint className="h-6 w-6 text-emerald-600" />
          </div>
          Biometric Authentication Hub
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold">SECURE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Authentication Stats */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-walmart-gray-900">Authenticated Today</span>
            </div>
            <Zap className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 mb-2">{authenticatedUsers.toLocaleString()}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-walmart-gray-600">Success Rate: 99.2%</span>
            <span className="text-green-600 font-semibold">+12% from yesterday</span>
          </div>
        </div>

        {/* Biometric Methods */}
        <div className="space-y-3">
          <h4 className="font-bold text-walmart-gray-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            Authentication Methods
          </h4>

          {biometricMethods.map((method, index) => (
            <div
              key={index}
              className={`${method.bgColor} p-4 rounded-xl ${method.borderColor} border hover:shadow-walmart-sm transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${method.bgColor} rounded-lg border ${method.borderColor}`}>
                    <method.icon className={`h-5 w-5 ${method.color}`} />
                  </div>
                  <div>
                    <span className="font-bold text-walmart-gray-900">{method.name}</span>
                    <p className="text-xs text-walmart-gray-600">{method.active.toLocaleString()} active sessions</p>
                  </div>
                </div>
                <Badge className={`${method.bgColor} ${method.color} ${method.borderColor} border font-semibold`}>
                  {method.accuracy}%
                </Badge>
              </div>
              <Progress value={method.accuracy} className="h-2" />
            </div>
          ))}
        </div>

        {/* Live Authentication Test */}
        <div className="border-t border-walmart-gray-200 pt-6">
          <div className="text-center mb-4">
            <h4 className="font-bold text-walmart-gray-900 mb-2">Live Authentication Test</h4>

            {authStatus === "idle" && (
              <div className="text-walmart-gray-600">
                <Fingerprint className="h-8 w-8 mx-auto mb-2 text-walmart-gray-400" />
                Ready for biometric verification
              </div>
            )}

            {authStatus === "scanning" && (
              <div className="text-walmart-blue">
                <div className="relative mx-auto w-16 h-16 mb-3">
                  <div className="absolute inset-0 border-4 border-walmart-blue/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-walmart-blue border-t-transparent rounded-full animate-spin"></div>
                  <Fingerprint className="absolute inset-0 m-auto h-6 w-6 text-walmart-blue" />
                </div>
                <p className="font-semibold">Scanning... {confidence.toFixed(0)}%</p>
              </div>
            )}

            {authStatus === "success" && (
              <div className="text-green-600">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                <p className="font-bold">Authentication Successful</p>
                <p className="text-sm text-walmart-gray-600">Identity verified with 99.7% confidence</p>
              </div>
            )}

            {authStatus === "failed" && (
              <div className="text-red-600">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-bold">Authentication Failed</p>
                <p className="text-sm text-walmart-gray-600">Please try again or use alternative method</p>
              </div>
            )}
          </div>

          {authStatus === "scanning" && <Progress value={confidence} className="mb-4 h-3" />}

          <Button onClick={startBiometricScan} disabled={isScanning} className="w-full btn-walmart micro-bounce">
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Scanning...
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4 mr-2" />
                Start Biometric Scan
              </>
            )}
          </Button>
        </div>

        {/* Security Features */}
        <div className="bg-walmart-gray-50 p-4 rounded-xl">
          <h4 className="font-bold text-walmart-gray-900 mb-3 text-sm">Security Features</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-walmart-gray-700">Liveness Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-walmart-gray-700">Anti-Spoofing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-walmart-gray-700">Template Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-walmart-gray-700">FIDO2 Compliant</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
