"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, DollarSign, Users, AlertCircle } from "lucide-react"
import { useFraudEvents, useRealTimeData } from "@/hooks/use-api"
import { FraudService } from "@/lib/api"
import { LoadingSpinner } from "./loading-spinner"

export function FraudDetection() {
  // Fetch fraud detection data
  const { data: fraudEvents, loading, error } = useFraudEvents({ limit: 100 })
  
  // Fetch fraud detection metrics
  const [fraudDetectionData, setFraudDetectionData] = useState<any>(null)
  
  React.useEffect(() => {
    FraudService.getFraudDetectionData().then(setFraudDetectionData).catch(console.error)
  }, [])

  // Set up real-time updates for fraud data
  const { data: realTimeFraudData } = useRealTimeData(
    () => Promise.resolve(fraudDetectionData),
    'fraud:update',
    (currentData, newData) => newData || currentData
  )

  const currentFraudData = realTimeFraudData || fraudDetectionData
  
  if (loading && !currentFraudData) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-6 w-6 text-purple-400" />
            AI Fraud Detection Engine
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
            <Brain className="h-6 w-6 text-purple-400" />
            AI Fraud Detection Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400 text-center py-4">
            Failed to load fraud data: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  const aiAccuracy = currentFraudData?.aiAccuracy || 97.8
  const fraudPrevented = currentFraudData?.fraudPrevented || 2.4
  const riskScore = currentFraudData?.riskScore || 23
  const fraudPatterns = currentFraudData?.patterns || [
    { pattern: "Unusual Purchase Velocity", confidence: 94, transactions: 156 },
    { pattern: "Geographic Anomaly", confidence: 87, transactions: 89 },
    { pattern: "Device Fingerprint Mismatch", confidence: 92, transactions: 234 },
    { pattern: "Behavioral Pattern Deviation", confidence: 89, transactions: 67 },
  ]

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-6 w-6 text-purple-400" />
          AI Fraud Detection Engine
          <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold animate-pulse">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-slate-300">AI Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-white">{aiAccuracy.toFixed(1)}%</div>
            <Progress value={aiAccuracy} className="h-2 mt-2" />
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 rounded-lg border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-300">Fraud Prevented</span>
            </div>
            <div className="text-2xl font-bold text-white">${fraudPrevented.toFixed(1)}M</div>
            <div className="text-xs text-green-400">This month</div>
          </div>

          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 p-4 rounded-lg border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-slate-300">Risk Score</span>
            </div>
            <div className="text-2xl font-bold text-white">{riskScore}</div>
            <Progress value={riskScore} className="h-2 mt-2" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            Detected Fraud Patterns
          </h3>
          <div className="space-y-3">
            {fraudPatterns.map((pattern: any, index: number) => (
              <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{pattern.pattern}</span>
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                    {pattern.confidence}% confidence
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="h-4 w-4" />
                    {pattern.transactions} transactions flagged
                  </div>
                  <Progress value={pattern.confidence} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-4 rounded-lg border border-blue-500/20">
          <h4 className="text-white font-semibold mb-2">Machine Learning Insights</h4>
          <p className="text-slate-300 text-sm">
            Our AI model has processed {currentFraudData?.totalTransactions?.toLocaleString() || '2.3M'} transactions today, 
            identifying {fraudEvents?.length || 847} potential fraud attempts with {aiAccuracy.toFixed(1)}%
            accuracy. The system continuously learns from new patterns to stay ahead of evolving threats.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
