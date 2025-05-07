"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function CustomSelect({ label, items, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-[200px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:border-purple-500 focus:ring-2 focus:ring-purple-500 transition"
      >
        {value ? items.find((item) => item.value === value)?.label : label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 overflow-y-auto max-h-60"
          >
            {items.map((item) => (
              <motion.li
                key={item.value}
                onClick={() => {
                  onChange(item.value);
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 hover:bg-purple-600 cursor-pointer transition"
              >
                {item.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
