import { motion } from "framer-motion";

export default function Quotes() {
  return (
    <div className="text-center text-white">
      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-2xl font-georgia italic mb-4"
      >
        "Understanding yourself is the beginning of all wisdom."
      </motion.blockquote>
      <cite className="text-white/80">- Aristotle</cite>
    </div>
  );
} 