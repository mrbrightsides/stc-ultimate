'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  Lock, 
  DollarSign,
  Clock,
  CheckCircle,
  GitBranch,
  Globe,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function TourEscrowAboutPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/30 bg-black/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/tour-escrow"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-purple-500 bg-black/60 hover:bg-purple-500/20 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to TourEscrow</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  About TourEscrow
                </h1>
                <p className="text-sm text-purple-300">
                  Part of <a href="https://stc-ultimate.elpeef.com/" className="underline hover:text-purple-200">STC Ultimate</a>
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-purple-500 text-purple-300">
              MNEE Hackathon 2025
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 mb-4">
            <Shield className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Powered by MNEE Programmable Money</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Revolutionizing Tourism Payments
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            TourEscrow is a blockchain-powered smart escrow system that eliminates payment delays, 
            automates revenue distribution, and brings transparency to the $1.9 trillion tourism industry.
          </p>
        </section>

        {/* What is TourEscrow */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-purple-300 flex items-center gap-2">
            <Zap className="h-8 w-8" />
            What is TourEscrow?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  The Problem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-300">Payment Delays</p>
                      <p className="text-sm text-gray-400">Traditional tourism payments take 30-60 days to settle</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-300">Manual Distribution</p>
                      <p className="text-sm text-gray-400">Revenue splits require manual processing and reconciliation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-300">Lack of Transparency</p>
                      <p className="text-sm text-gray-400">No real-time visibility into payment status and distribution</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/30 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-300 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  The Solution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-300">Instant Settlement</p>
                      <p className="text-sm text-gray-400">Smart contracts release funds automatically upon verification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <GitBranch className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-300">Automated Splits</p>
                      <p className="text-sm text-gray-400">Revenue distributed to all stakeholders in milliseconds</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-300">Full Transparency</p>
                      <p className="text-sm text-gray-400">Real-time dashboard shows all transactions and distributions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="bg-purple-500/30" />

        {/* How It Works */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-purple-300 flex items-center gap-2">
            <GitBranch className="h-8 w-8" />
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                step: '1',
                title: 'Book & Lock',
                description: 'Tourist books a tour and locks payment in MNEE stablecoin (1:1 USD)',
                icon: Lock,
                color: 'purple'
              },
              {
                step: '2',
                title: 'Service Delivery',
                description: 'Hotel/guide provides service and confirms completion',
                icon: CheckCircle,
                color: 'blue'
              },
              {
                step: '3',
                title: 'Auto-Release',
                description: 'Smart contract automatically releases escrowed funds',
                icon: Zap,
                color: 'green'
              },
              {
                step: '4',
                title: 'Split & Distribute',
                description: 'Funds split to hotel (70%), guide (15%), platform (10%), treasury (5%)',
                icon: GitBranch,
                color: 'pink'
              }
            ].map((item) => (
              <Card key={item.step} className={`border-${item.color}-500/30 bg-black/40 backdrop-blur-sm hover:scale-105 transition-transform`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full bg-${item.color}-500/20 flex items-center justify-center mb-2`}>
                    <item.icon className={`h-6 w-6 text-${item.color}-400`} />
                  </div>
                  <CardTitle className={`text-${item.color}-300`}>
                    Step {item.step}
                  </CardTitle>
                  <CardDescription className="text-white font-semibold">
                    {item.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="bg-purple-500/30" />

        {/* MNEE Integration */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-purple-300 flex items-center gap-2">
            <Coins className="h-8 w-8" />
            MNEE Integration
          </h3>
          <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300">Programmable Money for Tourism</CardTitle>
              <CardDescription className="text-gray-300">
                MNEE enables automated, trustless coordination between multiple parties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-purple-300">USD Stability</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    MNEE is pegged 1:1 to USD, eliminating crypto volatility risk for tourists and operators
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-blue-300">Smart Contract Logic</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Programmable rules govern escrow locks, releases, and multi-party splits automatically
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-400" />
                    </div>
                    <h4 className="font-semibold text-green-300">Base Network</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Built on Base (Ethereum L2) for low fees, fast settlements, and OnchainKit integration
                  </p>
                </div>
              </div>

              <div className="bg-black/60 rounded-lg p-4 border border-purple-500/30">
                <p className="text-sm font-mono text-purple-300 mb-2">MNEE Token Contract (Base Sepolia):</p>
                <code className="text-xs text-gray-400 break-all">
                  0x1234567890abcdef1234567890abcdef12345678
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="bg-purple-500/30" />

        {/* Coordination Features */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-purple-300 flex items-center gap-2">
            <Users className="h-8 w-8" />
            Multi-Party Coordination
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Activity Timeline',
                description: 'Real-time feed of all escrow locks, releases, and splits across the platform',
                icon: Clock,
                badge: 'Live Feed'
              },
              {
                title: 'Stakeholder Dashboard',
                description: 'Visual tracking of all parties (tourist, hotel, guide, platform, treasury) with status updates',
                icon: Users,
                badge: 'Multi-Party'
              },
              {
                title: 'Budget Visualization',
                description: 'Pie charts and waterfall views showing revenue allocation and distribution flow',
                icon: TrendingUp,
                badge: 'Transparency'
              },
              {
                title: 'Coordination Metrics',
                description: 'Trust score, settlement time, success rate, and parties coordinated counter',
                icon: CheckCircle,
                badge: 'Analytics'
              },
              {
                title: 'Transaction Transparency',
                description: 'Complete audit trail with blockchain verification for every transaction',
                icon: Shield,
                badge: 'Audit Trail'
              },
              {
                title: 'OnchainKit Integration',
                description: 'Swap tokens, fund wallet with fiat, and manage portfolio directly in-app',
                icon: Zap,
                badge: 'OnchainKit'
              }
            ].map((feature, index) => (
              <Card key={index} className="border-purple-500/30 bg-black/40 backdrop-blur-sm hover:border-purple-400/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <feature.icon className="h-8 w-8 text-purple-400" />
                    <Badge variant="outline" className="border-purple-500 text-purple-300 text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-purple-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="bg-purple-500/30" />

        {/* Benefits */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-purple-300 flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Benefits for Stakeholders
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-300">For Tourists</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Payment protected in escrow until service delivered</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">USD-stable pricing (no crypto volatility)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Instant refunds if service cancelled</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Complete transparency via blockchain audit trail</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-300">For Hotels & Guides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Instant payment upon service completion</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">No 30-60 day wait for settlement</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Automated revenue split distribution</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Lower payment processing fees</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-300">For Platforms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Automated commission collection</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Zero manual reconciliation overhead</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Real-time treasury dashboard</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Trust score builds platform reputation</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-300">For Regulators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Full transparency via blockchain records</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Immutable audit trail for compliance</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Automated tax collection via treasury split</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Real-time monitoring of tourism transactions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="bg-purple-500/30" />

        {/* FAQ */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-purple-300">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
              <AccordionTrigger className="text-purple-300 hover:text-purple-200">
                What is MNEE and why use it instead of regular crypto?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                MNEE is a stablecoin pegged 1:1 to USD, which means 1 MNEE = $1 USD always. This eliminates the volatility 
                risk of regular cryptocurrencies like ETH or BTC. Tourists can book tours knowing the exact cost in USD, 
                and operators receive the exact amount without currency fluctuation risk.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
              <AccordionTrigger className="text-purple-300 hover:text-purple-200">
                How does the escrow protect both tourists and operators?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                When a tourist books, funds are locked in a smart contract (escrow). The operator can't access funds until 
                service is delivered and verified. The tourist can't cancel without penalty after service starts. This creates 
                trust without requiring a third-party intermediary. If there's a dispute, the smart contract rules govern 
                refund/release automatically.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
              <AccordionTrigger className="text-purple-300 hover:text-purple-200">
                What are the revenue split percentages?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                The default split is: Hotel/Operator (70%), Guide/Coordinator (15%), Platform Commission (10%), 
                and Treasury/Tax (5%). These percentages are configurable per booking and encoded in the smart contract. 
                When escrow releases, funds are automatically distributed to all parties in milliseconds.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
              <AccordionTrigger className="text-purple-300 hover:text-purple-200">
                Do I need cryptocurrency experience to use TourEscrow?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                No! TourEscrow provides a user-friendly interface with OnchainKit integration. You can fund your wallet 
                with fiat (credit card, bank transfer) directly in the app, and all pricing is shown in USD. The blockchain 
                complexity is abstracted away - you just book, verify, and receive payment like any modern platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
              <AccordionTrigger className="text-purple-300 hover:text-purple-200">
                What networks does TourEscrow support?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                TourEscrow runs on Base (Ethereum Layer 2) for production and Base Sepolia for testing. Base offers 
                low gas fees (~$0.01 per transaction), fast confirmations (~2 seconds), and seamless OnchainKit integration. 
                We may expand to additional networks based on user demand.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-purple-500/30 rounded-lg px-4 bg-black/40">
              <AccordionTrigger className="text-purple-300 hover:text-purple-200">
                How is this different from traditional OTAs like Booking.com?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Traditional OTAs hold funds for 30-60 days and take 15-25% commission. TourEscrow settles instantly 
                (seconds after verification) and charges only 10% platform fee. Plus, you get full transparency via 
                blockchain audit trails, automated multi-party splits, and programmable escrow rules. No manual reconciliation needed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-12">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ready to Experience TourEscrow?
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join the future of tourism payments with instant settlements, automated coordination, and full transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tour-escrow"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              Try TourEscrow Now
            </Link>
            <a
              href="https://stc-ultimate.elpeef.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg border-2 border-purple-500 bg-black/60 hover:bg-purple-500/20 text-white font-semibold transition-colors"
            >
              Explore STC Ultimate
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 bg-black/60 backdrop-blur-sm py-8 mt-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="text-gray-400 text-sm">
            TourEscrow is a module of{' '}
            <a href="https://stc-ultimate.elpeef.com/" className="text-purple-400 hover:text-purple-300 underline">
              STC Ultimate
            </a>
            {' '}— Smart Tourism Platform powered by Blockchain, IoT, and AI
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>Built for MNEE Hackathon 2025</span>
            <span>•</span>
            <span>Powered by Base & OnchainKit</span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
