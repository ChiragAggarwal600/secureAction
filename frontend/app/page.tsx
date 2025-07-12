import { Suspense } from "react"
import { WalmartHeader } from "@/components/walmart-header"
import { SecurityOverview } from "@/components/security-overview"
import { ThreatIntelligence } from "@/components/threat-intelligence"
import { FraudProtection } from "@/components/fraud-protection"
import { BlockchainSecurity } from "@/components/blockchain-security"
import { ZeroTrustCenter } from "@/components/zero-trust-center"
import { BiometricHub } from "@/components/biometric-hub"
import { SecurityMetrics } from "@/components/security-metrics"
import { AlertCenter } from "@/components/alert-center"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-walmart-gray-50 walmart-mesh">
      <WalmartHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        <Suspense fallback={<LoadingSpinner />}>
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-walmart-gradient mb-4 tracking-tight">Walmart CyberShield</h1>
            <p className="text-xl text-walmart-gray-600 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade cybersecurity platform protecting millions of customers and transactions across Walmart's
              global digital ecosystem with AI-powered threat detection and blockchain security.
            </p>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Primary Dashboard - Takes up 3 columns */}
            <div className="xl:col-span-3 space-y-8">
              <SecurityOverview />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ThreatIntelligence />
                <FraudProtection />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <BlockchainSecurity />
                <ZeroTrustCenter />
                <SecurityMetrics />
              </div>
            </div>

            {/* Sidebar - Takes up 1 column */}
            <div className="xl:col-span-1 space-y-8">
              <AlertCenter />
              <BiometricHub />
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  )
}
