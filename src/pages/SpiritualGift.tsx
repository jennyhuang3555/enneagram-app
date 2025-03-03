import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { spiritualGiftContent } from "@/data/spiritualGiftContent";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SpiritualGift = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState(spiritualGiftContent["1"]);

  useEffect(() => {
    const fetchUserType = async () => {
      if (!user?.uid) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setContent(spiritualGiftContent[userData.dominant_type?.toString() || "1"]);
      }
    };
    fetchUserType();
  }, [user]);

  const toggleSection = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-500 via-blue-400 to-orange-200 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-normal text-white mb-6 font-georgia"
            >
              Spiritual Gift
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              {content.title}
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-black/80 font-georgia leading-relaxed">
                {isExpanded ? content.expandedContent : content.content}
              </p>
              <button
                onClick={toggleSection}
                className="flex items-center gap-2 text-purple-500 hover:text-purple-600 transition-colors"
              >
                <span className="text-sm font-georgia">
                  {isExpanded ? "Read less" : "Read more"}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default SpiritualGift; 