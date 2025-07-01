"use client"

import { MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export default function WhatsAppButton() {
  return (
    <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <button
        onClick={() => window.open("https://wa.me/917359381236?text=Hello", "_blank", "noopener noreferrer")}
        className="flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg text-white"
        aria-label="Contact via WhatsApp"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </motion.div>
  )
}
