import React from "react";
import { motion } from "framer-motion";

export default function SummaryCard({ heading, count, color, icon: Icon, percentage = null }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`relative bg-white rounded-2xl p-5 shadow-md border-t-4 ${color} backdrop-blur-md bg-white/60 transition-all duration-300`}
    >
      <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-lg pointer-events-none"></div>

      <div className="relative z-10 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600">{heading}</span>
          <div className="flex items-center gap-2">
            {percentage !== null && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full text-gray-600 bg-gray-200/50`}>
                {percentage >= 0 ? '+' : ''}{percentage}%
              </span>
            )}
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
        </div>
        
        <span className="text-3xl font-semibold mt-2 text-gray-600">{count}</span>
      </div>
    </motion.div>
  );
}