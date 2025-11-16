import React from "react";
import { motion } from "framer-motion";

export default function SummaryCard({ heading, count, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`relative bg-white rounded-2xl p-5 shadow-md border-t-4 ${color} backdrop-blur-md bg-white/60 transition-all duration-300`}
    >
      <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-lg pointer-events-none"></div>

      <div className="relative z-10 flex flex-col">
        <span className="text-sm font-semibold text-gray-600">{heading}</span>
        <span className="text-4xl font-bold mt-2 text-gray-900">{count}</span>
      </div>
    </motion.div>
  );
}

// Usage Example:
// <StatsCard heading="Total Users" count={120} color="border-blue-500 hover:border-blue-600" />