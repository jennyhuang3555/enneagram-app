import { motion } from "framer-motion";

interface GradientHeroProps {
  title: string;
  subtitle?: string;
  gradient?: string;
}

export const GradientHero = ({ 
  title, 
  subtitle,
  gradient = "from-purple-500 via-blue-400 to-orange-200"
}: GradientHeroProps) => {
  return (
    <div className="relative">
      <div className={`bg-gradient-to-br ${gradient} py-20 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-normal text-white mb-6 font-georgia"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-white/90 font-georgia"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}; 