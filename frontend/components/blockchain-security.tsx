"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link, CheckCircle, Clock, Hash, Shield, Zap, Globe } from "lucide-react"
import { useBlockchainTransactions, useRealTimeData } from "@/hooks/use-api"
import { BlockchainService } from "@/lib/api"
import { LoadingSpinner } from "./loading-spinner"
import { BlockchainTransaction } from "@/lib/types"

export function BlockchainSecurity() {
  // Fetch blockchain transactions
  const { data: transactions, loading, error } = useBlockchainTransactions({ limit: 10 })
  
  // Set up real-time updates for blockchain data
  const { data: realTimeBlockchainData } = useRealTimeData(
    () => BlockchainService.getBlockchainStats(),
    'blockchain:update',
    (currentData, newData) => newData || currentData
  )

  // Set up real-time transaction updates
  const { data: realTimeTransactions } = useRealTimeData(
    () => Promise.resolve(transactions || []),
    'blockchain:update',
    (currentTransactions, newData) => {
      if (!currentTransactions) return newData?.transactions || []
      return newData?.transactions || currentTransactions
    }
  )

  const currentTransactions = realTimeTransactions || transactions || []
  const statsData = realTimeBlockchainData
  const totalVerified = statsData?.totalVerified || 18947
  const blockHeight = statsData?.blockHeight || 2847293

  if (loading && !currentTransactions.length) {
    return (
      <Card className="bg-white border-walmart-gray-200 shadow-walmart-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-walmart-blue">
            <div className="p-2 bg-cyan-100 rounded-xl">
              <Link className="h-6 w-6 text-cyan-600" />
            </div>
            Blockchain Security Layer
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
            <div className="p-2 bg-cyan-100 rounded-xl">
              <Link className="h-6 w-6 text-cyan-600" />
            </div>
            Blockchain Security Layer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center py-4">
            Failed to load blockchain data: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      case "failed":
        return <CheckCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "verified":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="bg-white border-walmart-gray-200 shadow-walmart-md card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-walmart-blue">
          <div className="p-2 bg-cyan-100 rounded-xl">
            <Link className="h-6 w-6 text-cyan-600" />
          </div>
          Blockchain Security Layer
          <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 font-semibold">IMMUTABLE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Blockchain Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-100 p-4 rounded-xl border border-cyan-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-600" />
                <span className="font-semibold text-walmart-gray-900 text-sm">Verified Today</span>
              </div>
              <Zap className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-black text-cyan-600">{totalVerified.toLocaleString()}</p>
            <p className="text-xs text-walmart-gray-600">Transactions secured</p>
          </div>

          <div className="bg-gradient-to-br from-walmart-spark/10 to-walmart-spark/20 p-4 rounded-xl border border-walmart-spark/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-walmart-spark-dark" />
                <span className="font-semibold text-walmart-gray-900 text-sm">Block Height</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-black text-walmart-spark-dark">{blockHeight.toLocaleString()}</p>
            <p className="text-xs text-walmart-gray-600">Current block</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-walmart-gray-900 flex items-center gap-2">
              <Hash className="h-4 w-4 text-cyan-600" />
              Recent Blockchain Transactions
            </h4>
            <Button
              variant="outline"
              size="sm"
              className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 bg-transparent"
            >
              Explorer
            </Button>
          </div>

          <div className="space-y-2">
            {currentTransactions.length > 0 ? currentTransactions.map((tx: BlockchainTransaction) => (
              <div
                key={tx.id}
                className="bg-walmart-gray-50 p-3 rounded-xl hover:shadow-walmart-sm transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tx.status)}
                    <span className="font-mono text-sm text-walmart-gray-900">
                      {tx.transactionHash.substring(0, 8)}...{tx.transactionHash.substring(tx.transactionHash.length - 6)}
                    </span>
                  </div>
                  <Badge className={getStatusColor(tx.status)}>{tx.status?.toUpperCase()}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-walmart-gray-600">
                  <div>
                    <span className="block font-medium">Amount</span>
                    <span className="text-walmart-gray-900 font-semibold">${tx.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Block</span>
                    <span className="text-walmart-gray-900 font-semibold">#{tx.blockNumber}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Gas</span>
                    <span className="text-walmart-gray-900 font-semibold">{tx.gasUsed.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-walmart-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</div>
              </div>
            )) : (
              <div className="text-center py-8 text-walmart-gray-500">
                No transactions found
              </div>
            )}
          </div>
        </div>

        {/* Blockchain Info */}
        <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-50 p-4 rounded-xl border border-cyan-200">
          <h4 className="font-bold text-walmart-gray-900 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-600" />
            Blockchain Security Features
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-walmart-gray-900">Consensus</p>
              <p className="text-walmart-gray-600">Proof of Stake</p>
            </div>
            <div>
              <p className="font-semibold text-walmart-gray-900">Encryption</p>
              <p className="text-walmart-gray-600">SHA-256</p>
            </div>
            <div>
              <p className="font-semibold text-walmart-gray-900">Network</p>
              <p className="text-walmart-gray-600">Private Chain</p>
            </div>
            <div>
              <p className="font-semibold text-walmart-gray-900">Validators</p>
              <p className="text-walmart-gray-600">847 Active</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
