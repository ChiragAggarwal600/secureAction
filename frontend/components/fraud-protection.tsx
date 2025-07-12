"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, DollarSign, Users, AlertCircle, Zap, Target } from "lucide-react"

export function FraudProtection() {
  const [aiAccuracy, setAiAccuracy] = useState(98.7)
  const [fraudPrevented, setFraudPrevented] = useState(4.2)
  const [riskScore, setRiskScore] = useState(18)
  const [modelsActive, setModelsActive] = useState(12)

  useEffect(() => {
    const interval = setInterval(() => {
      setAiAccuracy((prev) => Math.max(96, Math.min(99.9, prev + (Math.random() - 0.5) * 0.3)))
      setFraudPrevented((prev) => prev + Math.random() * 0.05)
      setRiskScore((prev) => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 3)))
      setModelsActive((prev) => Math.max(8, Math.min(15, prev + Math.floor((Math.random() - 0.5) * 2))))
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const fraudPatterns = [
    {
      pattern: "Unusual Purchase Velocity",
      confidence: 96,
      transactions: 234,
      risk: "high",
      trend: "+15%",
    },
    {
      pattern: "Geographic Anomaly Detection",
      confidence: 91,
      transactions: 156,
      risk: "medium",
      trend: "-8%",
    },
    {
      pattern: "Device Fingerprint Mismatch",
      confidence: 94,
      transactions: 89,
      risk: "high",
      trend: "+23%",
    },
    {
      pattern: "Behavioral Pattern Deviation",
      confidence: 88,
      transactions: 67,
      risk: "low",
      trend: "-12%",
    },
  ]

  return (
    <Card className="bg-white border-walmart-gray-200 shadow-walmart-md card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-walmart-blue">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          AI Fraud Protection Engine
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-semibold">NEURAL NETWORK</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-walmart-gray-900">AI Accuracy</span>
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black text-purple-600">{aiAccuracy.toFixed(1)}%</p>
              <Progress value={aiAccuracy} className="h-3 bg-purple-200" />
              <p className="text-xs text-green-600 font-semibold">+1.2% this week</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-walmart-gray-900">Fraud Prevented</span>
              </div>
              <div className="text-xs font-semibold text-green-600 bg-green-200 px-2 py-1 rounded-full">THIS MONTH</div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black text-green-600">${fraudPrevented.toFixed(1)}M</p>
              <p className="text-xs text-walmart-gray-600">Estimated savings</p>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-walmart-gray-50 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-walmart-blue" />
              <span className="font-bold text-walmart-gray-900">Current Risk Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-walmart-blue">{riskScore}</span>
              <span className="text-sm text-walmart-gray-600">/100</span>
            </div>
          </div>
          <Progress value={riskScore} className="h-3 mb-2" />
          <div className="flex justify-between text-xs text-walmart-gray-600">
            <span>Low Risk</span>
            <span className="font-semibold">
              Current: {riskScore < 30 ? "LOW" : riskScore < 70 ? "MEDIUM" : "HIGH"}
            </span>
            <span>High Risk</span>
          </div>
        </div>

        {/* ML Models Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-walmart-blue/5 p-4 rounded-xl border border-walmart-blue/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-walmart-blue" />
              <span className="font-semibold text-walmart-gray-900 text-sm">Active Models</span>
            </div>
            <p className="text-2xl font-bold text-walmart-blue">{modelsActive}</p>
            <p className="text-xs text-walmart-gray-600">Neural networks running</p>
          </div>

          <div className="bg-walmart-spark/10 p-4 rounded-xl border border-walmart-spark/30">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-walmart-spark-dark" />
              <span className="font-semibold text-walmart-gray-900 text-sm">Protected Users</span>
            </div>
            <p className="text-2xl font-bold text-walmart-spark-dark">2.4M</p>
            <p className="text-xs text-walmart-gray-600">Active sessions</p>
          </div>
        </div>

        {/* Fraud Pattern Detection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-walmart-gray-900 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-walmart-blue" />
              Detected Fraud Patterns
            </h4>
            <Button
              variant="outline"
              size="sm"
              className="border-walmart-blue text-walmart-blue hover:bg-walmart-blue/10 bg-transparent"
            >
              Configure Models
            </Button>
          </div>

          <div className="space-y-3">
            {fraudPatterns.map((pattern, index) => (
              <div
                key={index}
                className="bg-walmart-gray-50 p-4 rounded-xl hover:shadow-walmart-sm transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-walmart-gray-900">{pattern.pattern}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`font-semibold ${
                        pattern.risk === "high"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : pattern.risk === "medium"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-green-100 text-green-800 border-green-200"
                      }`}
                    >
                      {pattern.confidence}% confidence
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-walmart-gray-600">
                    <Users className="h-4 w-4" />
                    {pattern.transactions} transactions flagged
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-xs ${
                        pattern.trend.startsWith("+") ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {pattern.trend}
                    </span>
                    <Progress value={pattern.confidence} className="w-16 h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-walmart-blue/5 via-purple-50 to-walmart-blue/5 p-5 rounded-xl border border-walmart-blue/20">
          <h4 className="font-bold text-walmart-gray-900 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-walmart-blue" />
            Machine Learning Insights
          </h4>
          <p className="text-sm text-walmart-gray-700 leading-relaxed">
            Our advanced neural network has processed{" "}
            <span className="font-bold text-walmart-blue">3.7M transactions</span> today, identifying{" "}
            <span className="font-bold text-red-600">1,247 potential fraud attempts</span> with
            <span className="font-bold text-green-600"> 98.7% accuracy</span>. The system continuously evolves, learning
            from new patterns to stay ahead of emerging fraud techniques across Walmart's global ecosystem.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
