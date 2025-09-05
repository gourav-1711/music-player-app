import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlertMessage({ message, show, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-white/10 text-white backdrop-blur-md shadow-lg text-sm font-medium z-[999999]"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
