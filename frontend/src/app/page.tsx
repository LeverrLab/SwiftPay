
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import StreamCard from "@/components/StreamCard";
import {
  Waves,
  Plus,
  TrendingUp,
  Users,
  Layers,
  Zap,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("received");

  // Mock data for the UI showcase
  const mockStreams = [
    {
      id: 0,
      sender: "ST1PQ...GZGM",
      recipient: "ST1SJ...YPD5",
      amountTotal: 500000000, // 500 STX
      amountWithdrawn: 120000000,
      startBlock: 100,
      stopBlock: 1100,
      isCancelled: false,
      type: "received" as const
    },
    {
      id: 1,
      sender: "ST1PQ...GZGM",
      recipient: "ST3AM...K7X3",
      amountTotal: 1000000000, // 1000 STX
      amountWithdrawn: 0,
      startBlock: 200,
      stopBlock: 1200,
      isCancelled: false,
      type: "sent" as const
    }
  ];

  return (
    <main className="min-h-screen pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-bold"
          >
            <Zap size={16} fill="currentColor" />
            <span>Streaming now on Stacks Layer 2</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
          >
            Money that <br />
            <span className="accent-gradient">Streams Like Water.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Wait for bi-weekly paychecks no more. SwiftPay enables programmable,
            real-time payment streams for the next generation of work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button className="primary-button group w-full sm:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-lg">
              Start Streaming <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="glass w-full sm:w-auto px-8 py-4 rounded-2xl font-bold hover:bg-white/5 transition-colors border border-white/10 text-lg flex items-center justify-center gap-2">
              Explore Streams
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features Banner */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Non-Custodial", desc: "Your keys, your streams. Fully audited Clarity contracts." },
            { icon: Layers, title: "Liquid NFTs", desc: "Streams are minted as NFTs. Trade future earnings instantly." },
            { icon: Smartphone, title: "Mobile Ready", desc: "Manage your payments from any Stacks-compatible wallet." }
          ].map((feat, i) => (
            <div key={i} className="glass p-8 flex flex-col items-center text-center gap-4 border border-white/5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                <feat.icon size={28} />
              </div>
              <h3 className="text-xl font-bold">{feat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
                <LayoutDashboard className="text-primary" size={32} /> Your Streams
              </h2>
              <p className="text-gray-500 font-medium">Manage and track your active payment flows in real-time.</p>
            </div>

            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab("received")}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "received" ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-gray-300"}`}
              >
                Received
              </button>
              <button
                onClick={() => setActiveTab("sent")}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "sent" ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-gray-300"}`}
              >
                Sent
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Action Card: Create New */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass p-6 border-dashed border-primary/40 flex flex-col items-center justify-center gap-4 text-primary bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer min-h-[350px]"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Plus size={32} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-white">New Stream</h3>
                <p className="text-sm text-gray-500">Initialize a new payment contract</p>
              </div>
            </motion.button>

            {/* Actual Streams */}
            <AnimatePresence mode="popLayout">
              {mockStreams
                .filter(s => s.type === activeTab)
                .map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Floating Background Elements */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full -z-10 translate-x-1/2 translate-y-1/2" />
    </main>
  );
}

function LayoutDashboard(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="11" rx="1" />
      <rect width="7" height="5" x="3" y="15" rx="1" />
    </svg>
  );
}
