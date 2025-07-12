"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link, CheckCircle, Clock, Hash, Shield } from "lucide-react"

interface BlockchainTransaction {
  id: string
  hash: string
  amount: number
  status: "verified" | "pending" | "failed"
  timestamp: Date
  gasUsed: number
}

export function BlockchainVerification() {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([])
  const [totalVerified, setTotalVerified] = useState(15847)

  useEffect(() => {
    const generateTransaction = (): BlockchainTransaction => ({
      id: Math.random().toString(36).substr(2, 9),
      hash: "0x" + Math.random().toString(16).substr(2, 40),
      amount: Math.floor(Math.random() * 1000) + 10,
      status: Math.random() > 0.1 ? "verified" : Math.random() > 0.5 ? "pending" : "failed",
      timestamp: new Date(),
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
    })

    const initialTransactions = Array.from({ length: 6 }, generateTransaction)
    setTransactions(initialTransactions)

    const interval = setInterval(() => {
      setTransactions((prev) => {
        const newTransaction = generateTransaction()
        if (newTransaction.status === "verified") {
          setTotalVerified((prev) => prev + 1)
        }
        return [newTransaction, ...prev.slice(0, 5)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "failed":
        return <CheckCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-600/20 text-green-300 border-green-500/30"
      case "pending":
        return "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
      case "failed":
        return "bg-red-600/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-600/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Link className="h-6 w-6 text-cyan-400" />
          Blockchain Transaction Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 p-4 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              <span className="text-white font-semibold">Total Verified Today</span>
            </div>
            <Badge className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30">{totalVerified.toLocaleString()}</Badge>
          </div>
          <p className="text-sm text-slate-300">All transactions secured with immutable blockchain technology</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Hash className="h-4 w-4 text-cyan-400" />
            Recent Transactions
          </h3>
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-slate-700/30 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(tx.status)}
                  <span className="text-white font-mono text-sm">
                    {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                  </span>
                </div>
                <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                <div>
                  <span className="block">Amount</span>
                  <span className="text-white font-semibold">${tx.amount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block">Gas Used</span>
                  <span className="text-white font-semibold">{tx.gasUsed.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-400">{tx.timestamp.toLocaleTimeString()}</div>
            </div>
          ))}
        </div>

        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">View Full Blockchain Explorer</Button>
      </CardContent>
    </Card>
  )
}
