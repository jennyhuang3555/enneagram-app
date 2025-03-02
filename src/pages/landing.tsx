import { motion } from "framer-motion";
import SessionTopics from "@/components/SessionTopics";
import HowItWorks from "@/components/HowItWorks";
import Quotes from "@/components/Quotes";
import TypesCarousel from "@/components/TypesCarousel";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Landing() {
  return (
    <main className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#types" className="text-white hover:text-white/80 transition-colors font-medium">
            Explore Enneagram Types
          </a>
          <Button 
            variant="outline" 
            className="border-white bg-white text-black hover:bg-transparent hover:text-white transition-colors"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section with About Section */}
      <div className="relative overflow-hidden">
        <div 
          className="min-h-screen relative flex items-center justify-center px-4"
          style={{
            backgroundImage: "url('/underwater-bright.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="max-w-4xl mx-auto text-center backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/20 shadow-lg relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-black/30 text-white text-sm font-medium backdrop-blur-md mb-4">
                Welcome to Inner Mirror
              </span>
              
              <h1 className="text-4xl md:text-6xl font-normal text-white tracking-tight">
                AI Coach for Conscious Transformation
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Discover your true self through the wisdom of the Enneagram, guided by advanced AI technology.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <button className="mt-8 px-8 py-4 bg-black hover:bg-black/80 text-white rounded-lg transition-all duration-300 shadow-lg">
                  Begin Your Journey
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* About Section with updated gradient transition: cyan-blue to white */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b647a] via-[#1b647a]/50 to-white"></div>
          <section className="relative py-20 px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto space-y-8 text-center"
            >
              <p className="text-xl md:text-2xl text-white leading-relaxed">
                The Enneagram is a mirror to help us see our patterns and free us into greater ways of being, supporting the unfolding of our true self.
              </p>
              
              <p className="text-lg md:text-xl text-black/80 leading-relaxed">
                Through using the enneagram as a mirror for personal inquiry, with somatic practices and parts work, you can discover a deeper, more grounded joy, freedom and fulfilment.
              </p>
            </motion.div>
          </section>
        </div>
      </div>

      <SessionTopics />
      
      {/* How It Works with light cyan background */}
      <div className="bg-[#e5f8fb]">
        <HowItWorks />
      </div>

      {/* Types Carousel Section */}
      <div id="types">
        <TypesCarousel />
      </div>
      
      {/* Mobile Scroll Indicator */}
      <div className="md:hidden fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded-full animate-bounce">
        <ChevronRight size={24} />
      </div>
      
      {/* Quotes Section with Container */}
      <div className="px-4 py-20 bg-[#e5f8fb]">
        <div className="max-w-4xl mx-auto">
          <div 
            className="rounded-2xl p-8 shadow-lg transform hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden"
            style={{
              backgroundImage: "url('/pexels-pixabay-40784.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="backdrop-blur-sm bg-black/30 rounded-xl p-6">
              <Quotes />
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-[#e5f8fb] text-center"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-normal text-black">
            Start Your Journey
          </h2>
          <button className="px-8 py-4 bg-black hover:bg-black/80 text-white rounded-lg text-xl font-medium transition-opacity duration-300 shadow-lg">
            Sign Up Free
          </button>
        </div>
      </motion.section>
    </main>
  );
}
