
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    Coins,
    XCircle,
    CheckCircle2,
    Trash2,
    ExternalLink
} from "lucide-react";

interface StreamCardProps {
    id: number;
    sender: string;
    recipient: string;
    amountTotal: number;
    amountWithdrawn: number;
    startBlock: number;
    stopBlock: number;
    isCancelled: boolean;
    type: "sent" | "received";
}

export default function StreamCard({ stream }: { stream: StreamCardProps }) {
    const [currentEarned, setCurrentEarned] = useState(0);
    const [progress, setProgress] = useState(0);

    // Simulated block counting for demo
    useEffect(() => {
        const timer = setInterval(() => {
            // In a real app, we'd fetch actual block height
            // For demo, we simulate the flow
            const now = Date.now() / 1000;
            const totalBlocks = stream.stopBlock - stream.startBlock;
            // Dummy logic to show movement
            const elapsed = Math.min(totalBlocks, Math.max(0, (now % 100)));
            const earned = (stream.amountTotal * elapsed) / totalBlocks;
            setCurrentEarned(earned + stream.amountWithdrawn);
            setProgress((earned / totalBlocks) * 100);
        }, 1000);
        return () => clearInterval(timer);
    }, [stream]);

    const microSTXtoSTX = (ustx: number) => (ustx / 1000000).toFixed(4);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 glass-hover group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stream.type === "sent"
                            ? "bg-orange-500/10 border-orange-500/30 text-orange-500"
                            : "bg-green-500/10 border-green-500/30 text-green-500"
                        }`}>
                        {stream.type === "sent" ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Stream #{stream.id}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock size={14} /> {stream.stopBlock - stream.startBlock} blocks duration
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xl font-black text-white">{microSTXtoSTX(stream.amountTotal)} STX</p>
                    <p className="text-xs text-gray-500 font-medium">Total Volume</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Stream Progress</span>
                        <span className="font-mono text-primary font-bold">{progress.toFixed(2)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className="h-full primary-button"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Earned So Far</p>
                        <p className="text-lg font-bold text-accent">{microSTXtoSTX(currentEarned)} STX</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Withdrawn</p>
                        <p className="text-lg font-bold text-gray-300">{microSTXtoSTX(stream.amountWithdrawn)} STX</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                    {stream.type === "received" ? (
                        <button className="flex-1 primary-button py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                            <Coins size={16} /> Withdraw
                        </button>
                    ) : (
                        <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
                            <Trash2 size={16} /> Cancel Stream
                        </button>
                    )}
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 transition-all">
                        <ExternalLink size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
